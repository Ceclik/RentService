import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Property } from '../properties/properties.model';
import { Roles } from '../auth/roles-auth.decorator';
import { RolesAuthGuard } from '@common/guards/roles-auth.guard';
import { CreateTypeDto } from './dto/create-type.dto';
import { TypesService } from './types.service';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';

@Controller('types')
export class TypesController {
  constructor(private typesService: TypesService) {}

  @ApiOperation({ summary: 'Creates types of properties' })
  @ApiResponse({ status: 200, type: Property })
  @Roles('ADMIN')
  @UseGuards(RolesAuthGuard)
  @Post('/add')
  create(@Body() dto: CreateTypeDto) {
    return this.typesService.createType(dto);
  }

  @ApiOperation({ summary: 'Returns all types of properties' })
  @ApiResponse({ status: 200, type: [Property] })
  @UseGuards(JwtAuthGuard)
  @Get('/all')
  getAllTypes() {
    return this.typesService.getAllTypes();
  }

  @ApiOperation({ summary: 'Creates types of properties' })
  @ApiResponse({ status: 200, type: String })
  @Roles('ADMIN')
  @UseGuards(RolesAuthGuard)
  @Delete('/:id')
  deleteType(@Param('id') id: number) {
    return this.typesService.deleteType(id);
  }
}
