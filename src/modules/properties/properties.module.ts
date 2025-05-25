import { forwardRef, Module } from '@nestjs/common';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Property } from './properties.model';
import { Description } from '../descriptions/descriptions.model';
import { Type } from '../types/types.model';
import { TypesModule } from '../types/types.module';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/users.model';
import { FilesModule } from '../files/files.module';
import { PropertyImage } from '../descriptions/property-images.model';
import { AnalyticsModule } from '../analytics/analytics.module';
import { Analytics } from '../analytics/analytics.model';
import { PropertiesRepository } from '@modules/properties/properties.repository';
import { TypesRepository } from '@modules/types/types.repository';
import { DescriptionsRepository } from '@modules/descriptions/descriptions.repository';
import { ImagesRepository } from '@modules/descriptions/images.repository';
import { AnalyticsRepository } from '@modules/analytics/analytics.repository';

@Module({
  controllers: [PropertiesController],
  providers: [
    PropertiesService,
    PropertiesRepository,
    TypesRepository,
    DescriptionsRepository,
    ImagesRepository,
    AnalyticsRepository
  ],
  imports: [
    SequelizeModule.forFeature([
      Property,
      Description,
      User,
      Type,
      PropertyImage,
      Analytics,
    ]),
    TypesModule,
    forwardRef(() => AuthModule),
    FilesModule,
    AnalyticsModule,
  ],
  exports: [PropertiesService],
})
export class PropertiesModule {}
