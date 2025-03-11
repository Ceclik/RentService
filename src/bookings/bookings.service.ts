import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Booking } from './bookings.model';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Property } from '../properties/properties.model';
import { Op } from 'sequelize';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking) private bookingsRepository: typeof Booking,
    @InjectModel(Property) private propertyRepository: typeof Property,
  ) {}

  async getAllBookings() {
    try {
      const bookings = await this.bookingsRepository.findAll({
        where: { status: 'confirmed' },
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
      const startDate = new Date(dto.startDate.split('.').reverse().join('-'));
      const endDate = new Date(dto.endDate.split('.').reverse().join('-'));

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new BadRequestException('Некорректный формат даты!');
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate < today) {
        throw new BadRequestException(
          'You can not book on a date in the past!',
        );
      }
      if (endDate <= startDate) {
        throw new BadRequestException(
          'End date should be after the start date!',
        );
      }

      const bookingProperty = await this.propertyRepository.findByPk(
        dto.propertyId,
      );
      if (!bookingProperty) {
        throw new BadRequestException('Required property does not exists!');
      }

      const overlappingBookings = await this.bookingsRepository.count({
        where: {
          propertyId: dto.propertyId,
          [Op.or]: [
            { startDate: { [Op.between]: [startDate, endDate] } },
            { endDate: { [Op.between]: [startDate, endDate] } },
            {
              startDate: { [Op.lte]: startDate },
              endDate: { [Op.gte]: endDate },
            },
          ],
        },
      });

      if (overlappingBookings > 0) {
        throw new BadRequestException(
          'You can not book on already booked date',
        );
      }

      return await this.bookingsRepository.create({
        status: dto.status,
        startDate,
        endDate,
        propertyId: dto.propertyId,
        clientId: dto.clientId,
      });


    } catch (e) {
      console.log(e);
      if (e instanceof BadRequestException)
        throw new BadRequestException(e.message);
      else throw new InternalServerErrorException();
    }
  }

  async getActiveBookingsByClientId(clientId: number) {
    try {
      return await this.bookingsRepository.findAll({ where: { clientId } });
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async removeBooking(id: number) {
    try {
      const bookingToRemove = await this.bookingsRepository.findByPk(id);

      if (!bookingToRemove || bookingToRemove.status === 'closed')
        throw new BadRequestException('Required booking does not exists');

      await bookingToRemove.update({ status: 'closed' });

      return JSON.stringify('Booking has been successfully deleted!');
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async getAllBookingsByClientId(clientId: number) {
    try {
      return await this.bookingsRepository.findAll({
        where: { clientId },
      });
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
