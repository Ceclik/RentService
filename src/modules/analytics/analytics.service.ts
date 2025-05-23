import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Analytics } from './analytics.model';
import { Transaction } from 'sequelize';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Analytics) private analyticsRepository: typeof Analytics,
  ) {}

  private catchException(e: Error) {
    if (e instanceof BadRequestException)
      throw new BadRequestException(e.message);
    console.log(e);
    throw new InternalServerErrorException();
  }

  async watchAnalytic(propertyId: number) {
    try {
      const analytics = await this.analyticsRepository.findOne({
        where: { propertyId },
      });
      if (!analytics)
        throw new BadRequestException('There is no such property');

      return analytics;
    } catch (e) {
      this.catchException(e);
    }
  }

  async increaseViews(propertyId: number) {
    try {
      const analytics = await this.analyticsRepository.findOne({
        where: { propertyId },
      });

      if (!analytics)
        throw new BadRequestException('There is no such property');

      await this.analyticsRepository.update(
        {
          views: analytics.views + 1,
        },
        {
          where: { id: analytics.id },
        },
      );
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
      const analytics = await this.analyticsRepository.findOne({
        where: { propertyId },
      });

      if (!analytics)
        throw new BadRequestException('There is no such property');

      await this.analyticsRepository.update(
        {
          bookings: analytics.bookings + 1,
        },
        {
          where: { id: analytics.id },
          transaction,
        },
      );
      return analytics;
    } catch (e) {
      this.catchException(e);
    }
  }

  async countRevenue(
    propertyId: number,
    bookingPrice: number,
    transaction: Transaction | undefined,
  ) {
    try {
      const analytics = await this.analyticsRepository.findOne({
        where: { propertyId },
      });

      if (!analytics)
        throw new BadRequestException('There is no such property');

      await this.analyticsRepository.update(
        {
          revenue: analytics.revenue + bookingPrice,
        },
        {
          where: { id: analytics.id },
          transaction,
        },
      );
      return analytics;
    } catch (e) {
      this.catchException(e);
    }
  }
}
