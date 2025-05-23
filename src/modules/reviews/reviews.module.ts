import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Review } from './rewiews.model';
import { ReviewImage } from './review-images.model';
import { FilesModule } from '../files/files.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  imports: [
    SequelizeModule.forFeature([Review, ReviewImage]),
    FilesModule,
    AuthModule,
  ],
})
export class ReviewsModule {}
