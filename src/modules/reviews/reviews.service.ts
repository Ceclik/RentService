import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from './rewiews.model';
import { ReviewImage } from './review-images.model';
import { CreateReviewDto } from './dto/create-review.dto';
import { FilesService } from '../files/files.service';
import { ReviewsRepository } from '@modules/reviews/reviews.repository';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review) private reviewsRepository: typeof Review,
    private reviewsRep: ReviewsRepository,
    @InjectModel(ReviewImage)
    private reviewsImageRepository: typeof ReviewImage,
    private filesService: FilesService,
  ) {}

  async getAllOfProperty(propertyId: number) {
    try {
      return await this.reviewsRep.getAllOfProperty(propertyId);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async getAllFromClient(clientId: number) {
    try {
      return await this.reviewsRep.getAllFromClient(clientId);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async addReview(dto: CreateReviewDto, images) {
    const transaction = await this.reviewsRep.createTransaction();
    try {
      let createdReview;
      if (transaction)
        createdReview = await this.reviewsRep.addNew(dto, images, transaction);
      return createdReview;
    } catch (e) {
      await transaction?.rollback();
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async removeReview(id: number) {
    try {
      await this.reviewsRep.remove(id);
      return JSON.stringify('Review has been successfully deleted!');
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async updateReview(dto: CreateReviewDto, images, reviewId: number) {
    const transaction = await this.reviewsRep.createTransaction();
    try {
      const reviewToUpdate = await this.reviewsRep.findById(reviewId);
      if (!reviewId) throw new BadRequestException('There is no such review!');

      if (transaction)
        await this.reviewsRep.update(dto, images, reviewId, transaction);

      if (transaction) await transaction?.commit();
      return reviewToUpdate;
    } catch (e) {
      await transaction?.rollback();
      if (e instanceof BadRequestException)
        throw new BadRequestException(e.message);
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
