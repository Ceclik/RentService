import { forwardRef, Module } from '@nestjs/common';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Contract } from './contracts.model';
import { Booking } from '../bookings/bookings.model';
import { BookingsModule } from '../bookings/bookings.module';
import { Property } from '../properties/properties.model';
import { AuthModule } from '../auth/auth.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { Analytics } from '../analytics/analytics.model';
import { ContractsRepository } from '@modules/contracts/contracts.repository';
import { BookingsRepository } from '@modules/bookings/bookings.repository';
import { PropertiesRepository } from '@modules/properties/properties.repository';

@Module({
  controllers: [ContractsController],
  providers: [
    ContractsService,
    ContractsRepository,
    BookingsRepository,
    PropertiesRepository,
  ],
  imports: [
    forwardRef(() => AuthModule),
    SequelizeModule.forFeature([Contract, Booking, Property, Analytics]),
    BookingsModule,
    AnalyticsModule,
  ],
})
export class ContractsModule {}
