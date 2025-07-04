import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Property } from './properties.model';
import { ReceivePropertyDto } from './dto/receive-property.dto';
import { FilesService } from '../files/files.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { PropertiesRepository } from '@modules/properties/properties.repository';
import { TypesRepository } from '@modules/types/types.repository';
import { DescriptionsRepository } from '@modules/descriptions/descriptions.repository';
import { ImagesRepository } from '@modules/descriptions/images.repository';
import { AnalyticsRepository } from '@modules/analytics/analytics.repository';
import { MinioService } from '@modules/minio/minio.service';

@Injectable()
export class PropertiesService {
  constructor(
    private descriptionRep: DescriptionsRepository,
    private typesRepository: TypesRepository,
    private imagesRepository: ImagesRepository,
    private analyticsRepository: AnalyticsRepository,
    private propertiesRepository: PropertiesRepository,
    private filesService: FilesService,
    private analyticsService: AnalyticsService,
    private minioService: MinioService,
  ) {}

  async createProperty(dto: ReceivePropertyDto, ownerId: number, images) {
    const transaction = await this.propertiesRepository.createTransaction();
    try {
      console.log(`dto in controller: ${JSON.stringify(dto)}`);
      const createPropertyDto = {
        title: dto.title,
        location: dto.location,
        price: dto.price,
        typeId: dto.typeId,
        ownerId,
      };
      if (!(await this.typesRepository.findById(dto.typeId)))
        throw new BadRequestException('Type with this id does not exists');

      let createdProperty: Property | undefined;
      createdProperty = undefined;

      if (transaction)
        createdProperty = await this.propertiesRepository.createProperty(
          createPropertyDto,
          transaction,
        );

      if (createdProperty)
        for (const description of dto.descriptions) {
          console.log(`description in cycle: ${JSON.stringify(description)}`);
          const createDescriptionDto = {
            title: description.title,
            description: description.description,
            propertyId: createdProperty.id,
          };

          if (transaction)
            await this.descriptionRep.createDescription(
              createDescriptionDto,
              transaction,
            );
        }

      for (const image of images) {
        //const filename = await this.filesService.createFile(image);
        const filename = await this.minioService.uploadFile(image);
        if (createdProperty && transaction)
          await this.imagesRepository.createPropertyImage(
            filename,
            createdProperty.id,
            transaction,
          );
      }

      if (createdProperty && transaction)
        await this.analyticsRepository.createAnalytics(
          createdProperty.id,
          transaction,
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
    return await this.propertiesRepository.findAllProperties();
  }

  async deleteProperty(id: number) {
    await this.propertiesRepository.deleteProperty(id);
    return JSON.stringify('Chosen property has been successfully deleted!');
  }

  async getOneProperty(id: number) {
    const property = await this.propertiesRepository.findById(id);
    if (!property) return JSON.stringify('There is no such property');
    await this.analyticsService.increaseViews(id);
    return property;
  }

  async updateProperty(dto: ReceivePropertyDto, ownerId: number, id: number) {
    const transaction = await this.propertiesRepository.createTransaction();
    try {
      if (!(await this.typesRepository.findById(dto.typeId)))
        throw new BadRequestException('Type with this id does not exists');

      if (transaction)
        await this.propertiesRepository.updateProperty(id, dto, transaction);

      const propertyDescriptions =
        await this.descriptionRep.findAllByPropertyId(id);

      for (let i = 0; i < propertyDescriptions.length; i++) {
        if (transaction)
          await this.descriptionRep.updateDescription(
            dto.descriptions[i].title,
            dto.descriptions[i].description,
            propertyDescriptions[i].id,
            transaction,
          );
      }

      if (transaction) await transaction.commit();
      return await this.propertiesRepository.findByIdIncludeAll(id);
    } catch (e) {
      console.log(e);
      if (transaction) await transaction.rollback();
      throw new InternalServerErrorException();
    }
  }
}
