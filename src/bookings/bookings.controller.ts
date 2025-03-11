import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles-auth.decorator';
import { RolesAuthGuard } from '../auth/guards/roles-auth.guard';
import { BookingsService } from './bookings.service';
import { Booking } from './bookings.model';
import { CreateBookingDto } from './dto/create-booking.dto';

@ApiTags('Operations with bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @ApiOperation({ summary: 'Returns all created bookings' })
  @ApiResponse({ status: 200, type: [Booking] })
  @Roles('ADMIN')
  @UseGuards(RolesAuthGuard)
  @Get('/all')
  getAll() {
    return this.bookingsService.getAllBookings();
  }

  @ApiOperation({ summary: 'Creates booking' })
  @ApiResponse({ status: 200, type: Booking })
  @Roles('CLIENT', 'ADMIN')
  @UseGuards(RolesAuthGuard)
  @Post('/add')
  createBooking(@Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(dto);
  }
}
