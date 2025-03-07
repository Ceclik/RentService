import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { Property } from './properties.model';
import { Roles } from '../auth/roles-auth.decorator';
import { RolesAuthGuard } from '../auth/guards/roles-auth.guard';
import { ReceivePropertyDto } from './dto/receive-property.dto';

@ApiTags('Operations with properties')
@Controller('properties')
export class PropertiesController {
  constructor(private propertiesService: PropertiesService) {}

  @ApiOperation({ summary: 'Creates properties' })
  @ApiResponse({ status: 200, type: Property })
  @Roles('ADMIN', 'OWNER')
  @UseGuards(RolesAuthGuard)
  @Post('/add')
  create(@Body() dto: ReceivePropertyDto, @Req() req) {
    const ownerId: number = req.user.id;
    return this.propertiesService.createProperty(dto, ownerId);
  }

  @ApiOperation({ summary: 'Returns all created properties' })
  @ApiResponse({ status: 200, type: [Property] })
  @Roles('CLIENT', 'OWNER', 'ADMIN')
  @UseGuards(RolesAuthGuard)
  @Get('/all')
  getAllProperties() {
    return this.propertiesService.getAllProperties();
  }
}
