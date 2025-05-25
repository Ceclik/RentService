import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Description } from '@modules/descriptions/descriptions.model';
import { CreateDescriptionDto } from '@modules/descriptions/dto/create-description.dto';
import { Transaction } from 'sequelize';

@Injectable()
export class DescriptionsRepository {
  constructor(
    @InjectModel(Description)
    private descriptionRepository: typeof Description,
  ) {}

  async createDescription(
    createDescriptionDto: CreateDescriptionDto,
    transaction: Transaction,
  ) {
    return await this.descriptionRepository.create(createDescriptionDto, {
      transaction,
    });
  }

  async findAllByPropertyId(propertyId: number) {
    return await this.descriptionRepository.findAll({
      where: { propertyId },
    });
  }

  async updateDescription(
    title: string,
    description: string,
    id: number,
    transaction: Transaction,
  ) {
    await this.descriptionRepository.update(
      {
        title,
        description,
      },
      {
        where: { id },
        transaction,
      },
    );
  }
}
