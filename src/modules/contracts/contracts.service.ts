import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { addDays, differenceInDays, startOfDay } from 'date-fns';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AnalyticsService } from '../analytics/analytics.service';
import { ContractsRepository } from '@modules/contracts/contracts.repository';
import { BookingsRepository } from '@modules/bookings/bookings.repository';
import { PropertiesRepository } from '@modules/properties/properties.repository';

@Injectable()
export class ContractsService {
  constructor(
    private contractsRepository: ContractsRepository,
    private bookingsRepository: BookingsRepository,
    private propertiesRepository: PropertiesRepository,
    private analyticsService: AnalyticsService,
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
      const contracts =
        await this.contractsRepository.findAllWithEndDate(today);

      for (const contract of contracts) {
        await this.contractsRepository.changeToClosedStatus(contract);
      }
    } catch (e) {
      this.catchException(e);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generateContractsForUpcomingBookings() {
    try {
      const tomorrow = startOfDay(addDays(new Date(), 1));
      const bookings =
        await this.bookingsRepository.findAllTomorrowBookings(tomorrow);

      if (bookings.length === 0) {
        console.log('There are no bookings to generate contract from');
        return;
      }

      for (const booking of bookings) {
        const property = await this.propertiesRepository.findById(
          booking.propertyId,
        );
        if (!property)
          throw new InternalServerErrorException('Property note is wrong');
        const totalPrice = this.calculateTotalAmount(
          booking.startDate,
          booking.endDate,
          property.price,
        );
        await this.contractsRepository.createContract(
          totalPrice,
          booking,
          property,
        );
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e.message);
    }
  }

  async confirmContract(id: number) {
    const transaction = await this.contractsRepository.createTransaction();
    try {
      const contractToConfirm =
        await this.contractsRepository.findByIdIncludingBookings(id);
      if (!contractToConfirm)
        throw new BadRequestException('There is no such contract!');

      if (transaction)
        await this.contractsRepository.confirmContract(
          contractToConfirm,
          transaction,
        );
      await this.analyticsService.countRevenue(
        contractToConfirm.booking.propertyId,
        contractToConfirm.totalPrice,
        transaction,
      );
      return contractToConfirm;
    } catch (e) {
      this.catchException(e);
    }
  }

  async getAllOfClient(clientId: number) {
    try {
      const contracts =
        await this.contractsRepository.findAllContractsOfClient(clientId);
      if (contracts.length === 0)
        return JSON.stringify('This client has no contracts');
      return contracts;
    } catch (e) {
      this.catchException(e);
    }
  }

  async getAllOfOwner(ownerId: number) {
    try {
      const contracts = await this.contractsRepository.findAllOfOwner(ownerId);
      if (contracts.length === 0)
        return JSON.stringify('This owner has no contracts');
      return contracts;
    } catch (e) {
      this.catchException(e);
    }
  }

  async getAllOfProperty(propertyId: number) {
    try {
      const contracts =
        await this.contractsRepository.findAllOfProperty(propertyId);

      if (contracts.length === 0)
        return JSON.stringify('This property has no contracts');
      return contracts;
    } catch (e) {
      this.catchException(e);
    }
  }
}
