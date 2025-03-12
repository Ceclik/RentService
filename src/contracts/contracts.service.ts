import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Contract } from './contracts.model';
import { InjectModel } from '@nestjs/sequelize';
import { Booking } from '../bookings/bookings.model';
import { addDays, differenceInDays, startOfDay } from 'date-fns';
import { Property } from '../properties/properties.model';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ContractsService {
  constructor(
    @InjectModel(Contract) private contractsRepository: typeof Contract,
    @InjectModel(Booking) private bookingRepository: typeof Booking,
    @InjectModel(Property) private propertyRepository: typeof Property,
  ) {}

  private calculateTotalAmount(
    startDate: Date,
    endDate: Date,
    pricePerDay: number,
  ) {
    const days = differenceInDays(new Date(endDate), new Date(startDate));

    if (days <= 0) {
      throw new Error(
        'Дата окончания бронирования должна быть позже даты начала.',
      );
    }

    return days * pricePerDay;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generateContractsForUpcomingBookings() {
    try {
      const tomorrow = startOfDay(addDays(new Date(), 1));
      const bookings = await this.bookingRepository.findAll({
        where: { startDate: tomorrow, status: 'confirmed' },
      });

      if (bookings.length === 0) {
        console.log('There are no bookings to generate contract from');
        return;
      }

      for (const booking of bookings) {
        const property = await this.propertyRepository.findByPk(
          booking.propertyId,
        );
        if (!property)
          throw new InternalServerErrorException('Property note is wrong');
        await this.contractsRepository.create({
          totalPrice: this.calculateTotalAmount(
            booking.startDate,
            booking.endDate,
            property.price,
          ),
          bookingId: booking.id,
          ownerId: property.ownerId,
          clientId: booking.clientId,
        });
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e.message);
    }
  }
}
