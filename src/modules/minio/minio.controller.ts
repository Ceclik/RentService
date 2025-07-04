import { Controller, Get, Param, Res } from '@nestjs/common';
import { MinioService } from '@modules/minio/minio.service';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Operations with files stored in s3 storage')
@Controller('api/files')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @ApiOperation({ summary: 'Returns file' })
  @ApiResponse({ status: 200 })
  @Get(':filename')
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    const fileStream = await this.minioService.getFile(filename);
    fileStream.pipe(res);
  }
}
