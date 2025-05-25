import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PropertyImage } from '@modules/descriptions/property-images.model';
import { Transaction } from 'sequelize';

@Injectable()
export class ImagesRepository {
  constructor(
    @InjectModel(PropertyImage)
    private imagesRepository: typeof PropertyImage,
  ) {}

  async createPropertyImage(
    imageUrl: string,
    propertyId: number,
    transaction: Transaction,
  ) {
    return await this.imagesRepository.create(
      {
        imageUrl,
        propertyId,
      },
      { transaction },
    );
  }
}
