import { forwardRef, Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Property } from '../properties/properties.model';
import { User } from '../users/users.model';
import { AuthModule } from '../auth/auth.module';
import { Booking } from './bookings.model';
import { Contract } from '../contracts/contracts.model';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService],
  imports: [
    SequelizeModule.forFeature([Property, User, Booking, Contract]),
    forwardRef(() => AuthModule),
  ],
  exports: [BookingsService],
})
export class BookingsModule {}
