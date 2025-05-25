import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Analytics } from './analytics.model';
import { AuthModule } from '../auth/auth.module';
import { AnalyticsRepository } from '@modules/analytics/analytics.repository';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, AnalyticsRepository],
  imports: [SequelizeModule.forFeature([Analytics]), AuthModule],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
