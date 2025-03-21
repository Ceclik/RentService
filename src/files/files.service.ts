import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';

@Injectable()
export class FilesService {
  async createFile(file): Promise<string> {
    try {
      const fileName = uuid.v4() + '.jpg';
      const filePath = path.resolve(__dirname, '..', 'static');
      await fs.promises.mkdir(filePath, { recursive: true });

      await fs.promises.writeFile(path.join(filePath, fileName), file.buffer);

      return fileName;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }
}
