import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import { Review } from '@modules/reviews/rewiews.model';
import { ReviewImage } from '@modules/reviews/review-images.model';
import { CreateReviewDto } from '@modules/reviews/dto/create-review.dto';
import { Transaction } from 'sequelize';
import { FilesService } from '@modules/files/files.service';
import { MinioService } from '@modules/minio/minio.service';

@Injectable()
export class ReviewsRepository {
  constructor(
    @InjectModel(Review) private reviewsRepository: typeof Review,
    @InjectModel(ReviewImage)
    private reviewsImageRepository: typeof ReviewImage,
    private filesService: FilesService,
    private minioService: MinioService,
  ) {}

  async createTransaction() {
    return await this.reviewsRepository.sequelize?.transaction();
  }

  async getAllOfProperty(propertyId: number) {
    return await this.reviewsRepository.findAll({
      where: { propertyId },
      include: { all: true },
    });
  }

  async getAllFromClient(clientId: number) {
    return await this.reviewsRepository.findAll({
      where: { clientId },
      include: { all: true },
    });
  }

  async addNew(dto: CreateReviewDto, images, transaction: Transaction) {
    const createdReview = await this.reviewsRepository.create(dto, {
      transaction,
    });

    for (const image of images) {
      const filename = await this.minioService.uploadFile(image);
      await this.reviewsImageRepository.create(
        { imageUrl: filename, reviewId: createdReview.id },
        { transaction },
      );
    }
    if (transaction) await transaction.commit();
    return createdReview;
  }

  async remove(id: number) {
    await this.reviewsRepository.destroy({ where: { id } });
  }

  async update(
    dto: CreateReviewDto,
    images,
    reviewId: number,
    transaction: Transaction,
  ) {
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
  }

  async findById(id: number) {
    return await this.reviewsRepository.findByPk(id);
  }
}
