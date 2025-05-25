import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Property } from './properties.model';

@Injectable()
export class PropertiesRepository {
  constructor(
    @InjectModel(Property) private readonly propertyRepository: typeof Property,
  ) {}

  async findById(id: number) {
    return await this.propertyRepository.findByPk(id);
  }
}
