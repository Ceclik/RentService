import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@common/decorators/roles-auth.decorator';
import { RolesAuthGuard } from '@common/guards/roles-auth.guard';
import { AnalyticsService } from './analytics.service';
import { Analytics } from './analytics.model';

@ApiTags('Operations with analytics')
@ApiBearerAuth('access-token')
@Controller('api/analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @ApiOperation({ summary: 'Returns an analytics about required property' })
  @ApiResponse({ status: 200, type: Analytics })
  @Roles('ADMIN', 'OWNER')
  @UseGuards(RolesAuthGuard)
  @Get('/:propertyId')
  watch(@Param('propertyId') propertyId: number) {
    return this.analyticsService.watchAnalytic(propertyId);
  }
}
