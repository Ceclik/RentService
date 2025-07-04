import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Review } from './rewiews.model';
import { ReviewImage } from './review-images.model';
import { FilesModule } from '../files/files.module';
import { AuthModule } from '../auth/auth.module';
import { ReviewsRepository } from '@modules/reviews/reviews.repository';
import { MinioModule } from '@modules/minio/minio.module';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewsRepository],
  imports: [
    SequelizeModule.forFeature([Review, ReviewImage]),
    FilesModule,
    AuthModule,
    MinioModule,
  ],
})
export class ReviewsModule {}
