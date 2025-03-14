import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Analytics } from './analytics.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  imports: [SequelizeModule.forFeature([Analytics]), AuthModule],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
