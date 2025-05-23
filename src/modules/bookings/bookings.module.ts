import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Property } from '../properties/properties.model';
import { User } from '../users/users.model';
import { AuthModule } from '../auth/auth.module';
import { Booking } from './bookings.model';
import { Contract } from '../contracts/contracts.model';
import { AnalyticsModule } from '../analytics/analytics.module';
import { Analytics } from '../analytics/analytics.model';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService],
  imports: [
    SequelizeModule.forFeature([Property, User, Booking, Contract, Analytics]),
    AuthModule,
    AnalyticsModule,
  ],
  exports: [BookingsService],
})
export class BookingsModule {}
