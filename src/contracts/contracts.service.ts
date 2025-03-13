import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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

  private catchException(e: Error) {
    if (e instanceof BadRequestException)
      throw new BadRequestException(e.message);
    else {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

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
  async closeContract() {
    try {
      const today = new Date();
      const contracts = await this.contractsRepository.findAll({
        include: [
          {
            model: Booking,
            where: { endDate: today },
          },
        ],
      });

      for (const contract of contracts) {
        await contract.update({ status: 'closed' });
      }
    } catch (e) {
      this.catchException(e);
    }
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

  async confirmContract(id: number) {
    try {
      const contractToConfirm = await this.contractsRepository.findByPk(id);
      if (!contractToConfirm)
        throw new BadRequestException('There is no such contract!');

      await contractToConfirm.update({ status: 'confirmed' });
      return contractToConfirm;
    } catch (e) {
      this.catchException(e);
    }
  }

  async getAllOfClient(clientId: number) {
    try {
      const contracts = await this.contractsRepository.findAll({
        where: { clientId },
      });
      if (contracts.length === 0)
        return JSON.stringify('This client has no contracts');
      return contracts;
    } catch (e) {
      this.catchException(e);
    }
  }

  async getAllOfOwner(ownerId: number) {
    try {
      const contracts = await this.contractsRepository.findAll({
        where: { ownerId },
      });
      if (contracts.length === 0)
        return JSON.stringify('This owner has no contracts');
      return contracts;
    } catch (e) {
      this.catchException(e);
    }
  }

  async getAllOfProperty(propertyId: number) {
    try {
      const contracts = await this.contractsRepository.findAll({
        include: [
          {
            model: Booking,
            where: { propertyId },
          },
        ],
      });

      if (contracts.length === 0)
        return JSON.stringify('This property has no contracts');
      return contracts;
    } catch (e) {
      this.catchException(e);
    }
  }
}
