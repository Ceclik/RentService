import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Property } from './properties.model';
import { CreatePropertyDto } from '@modules/properties/dto/create-property.dto';
import { Transaction } from 'sequelize';
import { PropertyImage } from '@modules/descriptions/property-images.model';
import { ReceivePropertyDto } from '@modules/properties/dto/receive-property.dto';

@Injectable()
export class PropertiesRepository {
  constructor(
    @InjectModel(Property) private readonly propertyRepository: typeof Property,
  ) {}

  async findById(id: number) {
    return await this.propertyRepository.findByPk(id);
  }

  async findByIdIncludeAll(id: number) {
    return await this.propertyRepository.findByPk(id, {
      include: { all: true },
    });
  }

  async createTransaction() {
    return await this.propertyRepository.sequelize?.transaction();
  }

  async createProperty(
    createPropertyDto: CreatePropertyDto,
    transaction: Transaction,
  ) {
    return await this.propertyRepository.create(createPropertyDto, {
      transaction,
    });
  }

  async findAllProperties() {
    return await this.propertyRepository.findAll({
      include: { model: PropertyImage },
    });
  }

  async deleteProperty(id: number) {
    await this.propertyRepository.destroy({ where: { id } });
  }

  async updateProperty(
    id: number,
    dto: ReceivePropertyDto,
    transaction: Transaction,
  ) {
    await this.propertyRepository.update(
      {
        title: dto.title,
        location: dto.location,
        price: dto.price,
        typeId: dto.typeId,
      },
      {
        where: { id },
        transaction,
      },
    );
  }
}
