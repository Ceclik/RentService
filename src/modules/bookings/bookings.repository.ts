import { InjectModel } from '@nestjs/sequelize';
import { Booking } from '@modules/bookings/bookings.model';
import { Op, Transaction } from 'sequelize';
import { CreateBookingDto } from '@modules/bookings/dto/create-booking.dto';

export class BookingsRepository {
  constructor(
    @InjectModel(Booking) private bookingsRepository: typeof Booking,
  ) {}

  async countOverlappingBookings(
    dto: CreateBookingDto,
    bookingId: number,
    startDate: Date,
    endDate: Date,
  ) {
    return await this.bookingsRepository.count({
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
  }

  async findAllBookingsIncludingAllDependencies() {
    return await this.bookingsRepository.findAll({
      include: { all: true },
    });
  }

  async createNewBooking(
    startDate: Date,
    endDate: Date,
    dto: CreateBookingDto,
    transaction: Transaction,
  ) {
    return await this.bookingsRepository.create(
      {
        startDate,
        endDate,
        propertyId: dto.propertyId,
        clientId: dto.clientId,
      },
      { transaction },
    );
  }

  async findActiveBookingsByClient(clientId: number) {
    return await this.bookingsRepository.findAll({
      where: { clientId, status: 'confirmed' },
    });
  }

  async findBookingById(bookingId: number) {
    return await this.bookingsRepository.findByPk(bookingId);
  }

  async updateBookingStatusToClosed(bookingToRemove: Booking) {
    await bookingToRemove.update({ status: 'closed' });
  }

  async findAllBookingOfClient(clientId: number) {
    return await this.bookingsRepository.findAll({
      where: { clientId },
    });
  }

  async updateBooking(
    bookingToUpdate: Booking,
    startDate: Date,
    endDate: Date,
    dto: CreateBookingDto,
  ) {
    await bookingToUpdate?.update({
      startDate,
      endDate,
      propertyId: dto.propertyId,
      clientId: dto.clientId,
    });
  }

  async findAllActiveBookingsOfProperty(propertyId: number) {
    return await this.bookingsRepository.findAll({
      where: {
        propertyId,
        status: { [Op.or]: ['confirmed', 'pending'] },
      },
    });
  }

  async findAllBookingsOfProperty(propertyId: number) {
    return await this.bookingsRepository.findAll({
      where: { propertyId },
    });
  }

  async confirmBooking(bookingToConfirm: Booking) {
    await bookingToConfirm.update({ status: 'confirmed' });
  }

  async createTransaction() {
    return await this.bookingsRepository.sequelize?.transaction();
  }
}
