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

  private catchError(e: Error) {
    if (e instanceof BadRequestException)
      throw new BadRequestException(e.message);
    else {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  private async validateBookingDates(
    dto: CreateBookingDto,
    bookingId?: number,
  ) {
    const startDate = new Date(dto.startDate.split('.').reverse().join('-'));
    const endDate = new Date(dto.endDate.split('.').reverse().join('-'));

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new BadRequestException('Wrong date format!');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      throw new BadRequestException('You can not book on a date in the past!');
    }
    if (endDate <= startDate) {
      throw new BadRequestException('End date should be after the start date!');
    }

    const overlappingBookings = await this.bookingsRepository.count({
      where: {
        propertyId: dto.propertyId,
        ...(bookingId ? { id: { [Op.ne]: bookingId } } : {}),
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
      throw new BadRequestException('You can not book on already booked date');
    }

    return { startDate, endDate };
  }

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
      this.catchError(e);
    }
  }

  async createBooking(dto: CreateBookingDto) {
    try {
      const { startDate, endDate } = await this.validateBookingDates(dto);

      return await this.bookingsRepository.create({
        startDate,
        endDate,
        propertyId: dto.propertyId,
        clientId: dto.clientId,
      });
    } catch (e) {
      if (e instanceof BadRequestException)
        throw new BadRequestException(e.message);
      else {
        this.catchError(e);
      }
    }
  }

  async getActiveBookingsByClientId(clientId: number) {
    try {
      return await this.bookingsRepository.findAll({
        where: { clientId, status: 'confirmed' },
      });
    } catch (e) {
      this.catchError(e);
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
      this.catchError(e);
    }
  }

  async getAllBookingsByClientId(clientId: number) {
    try {
      return await this.bookingsRepository.findAll({
        where: { clientId },
      });
    } catch (e) {
      this.catchError(e);
    }
  }

  async updateBooking(dto: CreateBookingDto, id: number) {
    try {
      const { startDate, endDate } = await this.validateBookingDates(dto, id);
      const bookingToUpdate = await this.bookingsRepository.findByPk(id);
      await bookingToUpdate?.update({
        startDate,
        endDate,
        propertyId: dto.propertyId,
        clientId: dto.clientId,
      });
      return bookingToUpdate;
    } catch (e) {
      this.catchError(e);
    }
  }

  async getAllActiveBookingsOfProperty(propertyId: number) {
    try {
      const foundBookings = await this.bookingsRepository.findAll({
        where: {
          propertyId,
          status: { [Op.or]: ['confirmed', 'pending'] },
        },
      });
      if (!foundBookings)
        return JSON.stringify(
          'This property does not have any active bookings',
        );
      return foundBookings;
    } catch (e) {
      this.catchError(e);
    }
  }

  async getAllBookingsOfProperty(propertyId: number) {
    try {
      const foundBookings = await this.bookingsRepository.findAll({
        where: { propertyId },
      });
      if (!foundBookings)
        return JSON.stringify('This property does not have any bookings');
      return foundBookings;
    } catch (e) {
      this.catchError(e);
    }
  }

  async confirmBooking(id: number) {
    try {
      const bookingToConfirm = await this.bookingsRepository.findByPk(id);
      if (!bookingToConfirm)
        throw new BadRequestException('There is not such booking');
      await bookingToConfirm.update({ status: 'confirmed' });
      return bookingToConfirm;
    } catch (e) {
      this.catchError(e);
    }
  }
}
