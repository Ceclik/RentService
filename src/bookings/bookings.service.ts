import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Booking } from './bookings.model';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Property } from '../properties/properties.model';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking) private bookingsRepository: typeof Booking,
    @InjectModel(Property) private propertyRepository: typeof Property,
  ) {}

  async getAllBookings() {
    try {
      const bookings = await this.bookingsRepository.findAll({
        include: { all: true },
      });
      if (!bookings)
        return JSON.stringify('There are no created bookings yet!');
      return bookings;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async createBooking(dto: CreateBookingDto) {
    try {
      const bookingProperty = await this.propertyRepository.findByPk(
        dto.propertyId,
      );

      if (!bookingProperty)
        throw new BadRequestException('Required property does not exists');

      await bookingProperty.update({ isAvailableToBook: false });
      return await this.bookingsRepository.create(dto);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
