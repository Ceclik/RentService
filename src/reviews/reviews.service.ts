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

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review) private reviewsRepository: typeof Review,
    @InjectModel(ReviewImage)
    private reviewsImageRepository: typeof ReviewImage,
    private filesService: FilesService,
  ) {}

  async getAllOfProperty(propertyId: number) {
    try {
      return await this.reviewsRepository.findAll({
        where: { propertyId },
        include: { all: true },
      });
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async getAllFromClient(clientId: number) {
    try {
      return await this.reviewsRepository.findAll({
        where: { clientId },
        include: { all: true },
      });
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async addReview(dto: CreateReviewDto, images) {
    const transaction = await this.reviewsRepository.sequelize?.transaction();
    try {
      const createdReview = await this.reviewsRepository.create(dto, {
        transaction,
      });

      for (const image of images) {
        const imageUrl = await this.filesService.createFile(image);

        await this.reviewsImageRepository.create(
          { imageUrl, reviewId: createdReview.id },
          { transaction },
        );
      }
      if (transaction) await transaction.commit();
      return createdReview;
    } catch (e) {
      await transaction?.rollback();
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async removeReview(id: number) {
    try {
      await this.reviewsRepository.destroy({ where: { id } });
      return JSON.stringify('Review has been successfully deleted!');
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async updateReview(dto: CreateReviewDto, images, reviewId: number) {
    const transaction = await this.reviewsRepository.sequelize?.transaction();
    try {
      const reviewToUpdate = await this.reviewsRepository.findByPk(reviewId);
      if (!reviewId) throw new BadRequestException('There is no such review!');

      await this.reviewsRepository.update(
        {
          rating: dto.rating,
          review: dto.review,
          clientId: dto.clientId,
          propertyId: dto.propertyId,
        },
        {
          where: { id: reviewId },
          transaction,
        },
      );

      await this.reviewsImageRepository.destroy({
        where: { reviewId },
      });

      for (const image of images) {
        const imageUrl = await this.filesService.createFile(image);

        await this.reviewsImageRepository.create(
          { imageUrl, reviewId },
          { transaction },
        );
      }
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
