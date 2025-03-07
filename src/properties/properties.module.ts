import { forwardRef, Module } from '@nestjs/common';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { DescriptionsModule } from '../descriptions/descriptions.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Property } from './properties.model';
import { Description } from '../descriptions/descriptions.model';
import { Type } from '../types/types.model';
import { TypesModule } from '../types/types.module';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/users.model';

@Module({
  controllers: [PropertiesController],
  providers: [PropertiesService],
  imports: [
    DescriptionsModule,
    SequelizeModule.forFeature([Property, Description, User, Type]),
    TypesModule,
    forwardRef(() => AuthModule),
  ],
  exports: [PropertiesService],
})
export class PropertiesModule {}
