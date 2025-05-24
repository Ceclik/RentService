import { Injectable } from '@nestjs/common';
import { Analytics } from '@modules/analytics/analytics.model';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';

@Injectable()
export class AnalyticsRepository {
  constructor(
    @InjectModel(Analytics) private analyticsRepository: typeof Analytics,
  ) {}

  async findOneByPropertyId(propertyId: number) {
    return await this.analyticsRepository.findOne({
      where: {
        propertyId,
      },
    });
  }

  async increaseViews(foundAnalytics: Analytics) {
    await this.analyticsRepository.update(
      {
        views: foundAnalytics.views + 1,
      },
      {
        where: { id: foundAnalytics.id },
      },
    );
  }

  async increaseBookings(foundAnalytics: Analytics, transaction: Transaction) {
    await this.analyticsRepository.update(
      {
        bookings: foundAnalytics.bookings + 1,
      },
      {
        where: { id: foundAnalytics.id },
        transaction,
      },
    );
  }

  async countRevenue(
    foundAnalytics: Analytics,
    bookingPrice: number,
    transaction: Transaction,
  ) {
    await this.analyticsRepository.update(
      {
        revenue: foundAnalytics.revenue + bookingPrice,
      },
      {
        where: { id: foundAnalytics.id },
        transaction,
      },
    );
  }
}
