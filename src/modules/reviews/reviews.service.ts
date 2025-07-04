import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsRepository } from '@modules/reviews/reviews.repository';

@Injectable()
export class ReviewsService {
  constructor(private reviewsRepository: ReviewsRepository) {}

  async getAllOfProperty(propertyId: number) {
    try {
      return await this.reviewsRepository.getAllOfProperty(propertyId);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async getAllFromClient(clientId: number) {
    try {
      return await this.reviewsRepository.getAllFromClient(clientId);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async addReview(dto: CreateReviewDto, images) {
    const transaction = await this.reviewsRepository.createTransaction();
    try {
      let createdReview;
      if (transaction)
        createdReview = await this.reviewsRepository.addNew(
          dto,
          images,
          transaction,
        );
      return createdReview;
    } catch (e) {
      await transaction?.rollback();
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async removeReview(id: number) {
    try {
      await this.reviewsRepository.remove(id);
      return JSON.stringify('Review has been successfully deleted!');
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async updateReview(dto: CreateReviewDto, images, reviewId: number) {
    const transaction = await this.reviewsRepository.createTransaction();
    try {
      const reviewToUpdate = await this.reviewsRepository.findById(reviewId);
      if (!reviewId) throw new BadRequestException('There is no such review!');

      if (transaction)
        await this.reviewsRepository.update(dto, images, reviewId, transaction);

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
