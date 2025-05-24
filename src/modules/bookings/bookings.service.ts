import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Booking } from './bookings.model';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AnalyticsService } from '../analytics/analytics.service';
import { BookingsRepository } from '@modules/bookings/bookings.repository';

@Injectable()
export class BookingsService {
  constructor(
    private bookingsRepository: BookingsRepository,
    private analyticsService: AnalyticsService,
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

    let overlappingBookings: number;
    overlappingBookings = 5;
    if (bookingId)
      overlappingBookings =
        await this.bookingsRepository.countOverlappingBookings(
          dto,
          bookingId,
          startDate,
          endDate,
        );

    if (overlappingBookings > 0) {
      throw new BadRequestException('You can not book on already booked date');
    }

    return { startDate, endDate };
  }

  async getAllBookings() {
    try {
      const bookings =
        await this.bookingsRepository.findAllBookingsIncludingAllDependencies();
      if (!bookings)
        return JSON.stringify('There are no created bookings yet!');
      return bookings;
    } catch (e) {
      this.catchError(e);
    }
  }

  async createBooking(dto: CreateBookingDto) {
    const transaction = await this.bookingsRepository.createTransaction();
    try {
      const { startDate, endDate } = await this.validateBookingDates(dto);

      let createdBooking: Booking | undefined;
      createdBooking = undefined;
      if (transaction)
        createdBooking = await this.bookingsRepository.createNewBooking(
          startDate,
          endDate,
          dto,
          transaction,
        );
      if (createdBooking)
        await this.analyticsService.increaseBookings(
          createdBooking.propertyId,
          transaction,
        );
      if (transaction) await transaction?.commit();

      return createdBooking;
    } catch (e) {
      await transaction?.rollback();
      if (e instanceof BadRequestException)
        throw new BadRequestException(e.message);
      else {
        this.catchError(e);
      }
    }
  }

  async getActiveBookingsByClientId(clientId: number) {
    try {
      return await this.bookingsRepository.findActiveBookingsByClient(clientId);
    } catch (e) {
      this.catchError(e);
    }
  }

  async removeBooking(id: number) {
    try {
      const bookingToRemove = await this.bookingsRepository.findBookingById(id);

      if (!bookingToRemove || bookingToRemove.status === 'closed')
        throw new BadRequestException('Required booking does not exists');

      await this.bookingsRepository.updateBookingStatusToClosed(
        bookingToRemove,
      );

      return JSON.stringify('Booking has been successfully deleted!');
    } catch (e) {
      this.catchError(e);
    }
  }

  async getAllBookingsByClientId(clientId: number) {
    try {
      return await this.bookingsRepository.findAllBookingOfClient(clientId);
    } catch (e) {
      this.catchError(e);
    }
  }

  async updateBooking(dto: CreateBookingDto, id: number) {
    try {
      const { startDate, endDate } = await this.validateBookingDates(dto, id);
      const bookingToUpdate = await this.bookingsRepository.findBookingById(id);
      if (bookingToUpdate)
        await this.bookingsRepository.updateBooking(
          bookingToUpdate,
          startDate,
          endDate,
          dto,
        );
      return bookingToUpdate;
    } catch (e) {
      this.catchError(e);
    }
  }

  async getAllActiveBookingsOfProperty(propertyId: number) {
    try {
      const foundBookings =
        await this.bookingsRepository.findAllActiveBookingsOfProperty(
          propertyId,
        );
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
      const foundBookings =
        await this.bookingsRepository.findAllBookingsOfProperty(propertyId);
      if (!foundBookings)
        return JSON.stringify('This property does not have any bookings');
      return foundBookings;
    } catch (e) {
      this.catchError(e);
    }
  }

  async confirmBooking(id: number) {
    try {
      const bookingToConfirm =
        await this.bookingsRepository.findBookingById(id);
      if (!bookingToConfirm)
        throw new BadRequestException('There is not such booking');
      await this.bookingsRepository.confirmBooking(bookingToConfirm);
      return bookingToConfirm;
    } catch (e) {
      this.catchError(e);
    }
  }
}
