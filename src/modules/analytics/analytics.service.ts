import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Transaction } from 'sequelize';
import { AnalyticsRepository } from '@modules/analytics/analytics.Repository';

@Injectable()
export class AnalyticsService {
  constructor(private analyticsRepository: AnalyticsRepository) {}

  private catchException(e: Error) {
    if (e instanceof BadRequestException)
      throw new BadRequestException(e.message);
    console.log(e);
    throw new InternalServerErrorException();
  }

  async watchAnalytic(propertyId: number) {
    try {
      const analytics =
        await this.analyticsRepository.findOneByPropertyId(propertyId);
      if (!analytics)
        throw new BadRequestException('There is no such property');

      return analytics;
    } catch (e) {
      this.catchException(e);
    }
  }

  async increaseViews(propertyId: number) {
    try {
      const analytics =
        await this.analyticsRepository.findOneByPropertyId(propertyId);

      if (!analytics)
        throw new BadRequestException('There is no such property');

      await this.analyticsRepository.increaseViews(analytics);
      return analytics;
    } catch (e) {
      this.catchException(e);
    }
  }

  async increaseBookings(
    propertyId: number,
    transaction: Transaction | undefined,
  ) {
    try {
      const analytics =
        await this.analyticsRepository.findOneByPropertyId(propertyId);

      if (!analytics)
        throw new BadRequestException('There is no such property');

      if (transaction)
        await this.analyticsRepository.increaseBookings(analytics, transaction);
      return analytics;
    } catch (e) {
      this.catchException(e);
      await transaction?.rollback();
    }
  }

  async countRevenue(
    propertyId: number,
    bookingPrice: number,
    transaction: Transaction | undefined,
  ) {
    try {
      const analytics =
        await this.analyticsRepository.findOneByPropertyId(propertyId);

      if (!analytics)
        throw new BadRequestException('There is no such property');

      if (transaction)
        await this.analyticsRepository.countRevenue(
          analytics,
          bookingPrice,
          transaction,
        );
      return analytics;
    } catch (e) {
      this.catchException(e);
    }
  }
}
