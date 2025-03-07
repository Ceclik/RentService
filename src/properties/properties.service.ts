import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Property } from './properties.model';
import { Description } from '../descriptions/descriptions.model';
import { Type } from '../types/types.model';
import { ReceivePropertyDto } from './dto/receive-property.dto';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(Property) private propertyRepository: typeof Property,
    @InjectModel(Description) private descriptionRepository: typeof Description,
    @InjectModel(Type) private typesRepository: typeof Type,
  ) {}

  async createProperty(dto: ReceivePropertyDto, ownerId: number) {
    const transaction = await this.propertyRepository.sequelize?.transaction();
    try {
      const createPropertyDto = {
        title: dto.title,
        location: dto.location,
        price: dto.price,
        typeId: dto.typeId,
        ownerId,
      };
      if (!(await this.typesRepository.findByPk(dto.typeId)))
        throw new BadRequestException('Type with this id does not exists');

      const createdProperty = await this.propertyRepository.create(
        createPropertyDto,
        {
          transaction,
        },
      );

      for (const description of dto.descriptions) {
        const createDescriptionDto = {
          title: description.title,
          description: description.description,
          propertyId: createdProperty.id,
        };
        await this.descriptionRepository.create(createDescriptionDto, {
          transaction,
        });
      }

      if (transaction) await transaction.commit();
      return createdProperty;
    } catch (e) {
      console.log(e);
      if (transaction) await transaction.rollback();
      throw new InternalServerErrorException();
    }
  }

  async getAllProperties() {
    return await this.propertyRepository.findAll({ include: { all: true } });
  }
}
