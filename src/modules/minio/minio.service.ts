import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

import { File as MulterFile } from 'multer';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Readable } from 'stream';
import * as uuid from 'uuid';
import { extname } from 'path';

@Injectable()
export class MinioService {
  private s3Client: S3Client;

  private readonly bucketName = 'online-rent-service-images';

  constructor() {
    this.s3Client = new S3Client({
      region: 'us-east-1',
      endpoint: 'http://localhost:9000',
      credentials: {
        accessKeyId: 'minioadmin',
        secretAccessKey: 'minioadmin123',
      },

      forcePathStyle: true,
    });
  }

  async uploadFile(file: MulterFile): Promise<string> {
    const fileExtension = extname(file.originalname);

    const hashedFileName = uuid.v4() + '.jpg';

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: hashedFileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);

    return hashedFileName;
  }

  async getFile(key: string): Promise<Readable> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      const response = await this.s3Client.send(command);
      return response.Body as Readable;
    } catch (error: any) {
      if (
        error.name === 'NoSuchKey' ||
        error.$metadata?.httpStatusCode === 404
      ) {
        throw new NotFoundException(`Файл "${key}" не найден в бакете`);
      }

      console.error(`Ошибка при получении файла "${key}":`, error);

      throw new InternalServerErrorException(
        'Ошибка при получении файла с MinIO',
      );
    }
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    await this.s3Client.send(command);
  }
}
