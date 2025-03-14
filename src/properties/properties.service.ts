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
import { PropertyImage } from '../descriptions/property-images.model';
import { FilesService } from '../files/files.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { Analytics } from '../analytics/analytics.model';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(Property) private propertyRepository: typeof Property,
    @InjectModel(Description) private descriptionRepository: typeof Description,
    @InjectModel(Type) private typesRepository: typeof Type,
    @InjectModel(PropertyImage) private imagesRepository: typeof PropertyImage,
    @InjectModel(Analytics) private analyticsRepository: typeof Analytics,
    private filesService: FilesService,
    private analyticsService: AnalyticsService,
  ) {}

  async createProperty(dto: ReceivePropertyDto, ownerId: number, images) {
    const transaction = await this.propertyRepository.sequelize?.transaction();
    try {
      console.log(`dto in controller: ${JSON.stringify(dto)}`);
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
        console.log(`description in cycle: ${JSON.stringify(description)}`);
        const createDescriptionDto = {
          title: description.title,
          description: description.description,
          propertyId: createdProperty.id,
        };
        await this.descriptionRepository.create(createDescriptionDto, {
          transaction,
        });
      }

      for (const image of images) {
        const imageUrl = await this.filesService.createFile(image);
        await this.imagesRepository.create(
          {
            imageUrl,
            propertyId: createdProperty.id,
          },
          { transaction },
        );
      }

      await this.analyticsRepository.create(
        { propertyId: createdProperty.id },
        { transaction },
      );

      if (transaction) await transaction.commit();
      return createdProperty;
    } catch (e) {
      console.log(e);
      if (transaction) await transaction.rollback();
      throw new InternalServerErrorException();
    }
  }

  async getAllProperties() {
    return await this.propertyRepository.findAll({
      include: { model: PropertyImage },
    });
  }

  async deleteProperty(id: number) {
    await this.propertyRepository.destroy({ where: { id } });
    return JSON.stringify('Chosen property has been successfully deleted!');
  }

  async getOneProperty(id: number) {
    const property = await this.propertyRepository.findByPk(id);
    if (!property) return JSON.stringify('There is no such property');
    await this.analyticsService.increaseViews(id);
    return property;
  }

  async updateProperty(dto: ReceivePropertyDto, ownerId: number, id: number) {
    const transaction = await this.propertyRepository.sequelize?.transaction();
    try {
      if (!(await this.typesRepository.findByPk(dto.typeId)))
        throw new BadRequestException('Type with this id does not exists');

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

      const propertyDescriptions = await this.descriptionRepository.findAll({
        where: { propertyId: id },
      });

      for (let i = 0; i < propertyDescriptions.length; i++) {
        await this.descriptionRepository.update(
          {
            title: dto.descriptions[i].title,
            description: dto.descriptions[i].description,
          },
          {
            where: { id: propertyDescriptions[i].id },
            transaction,
          },
        );
      }

      if (transaction) await transaction.commit();
      return await this.propertyRepository.findByPk(id, {
        include: { all: true },
      });
    } catch (e) {
      console.log(e);
      if (transaction) await transaction.rollback();
      throw new InternalServerErrorException();
    }
  }
}
