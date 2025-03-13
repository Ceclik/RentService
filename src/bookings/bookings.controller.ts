import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
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

  @ApiOperation({
    summary: 'Returns all active bookings of specified user',
  })
  @ApiResponse({ status: 200, type: [Booking] })
  @Roles('CLIENT', 'ADMIN')
  @UseGuards(RolesAuthGuard)
  @Get('/getAllActiveOfUser/:clientId')
  getAllActiveOfUser(@Param('clientId') clientId: number) {
    return this.bookingsService.getActiveBookingsByClientId(clientId);
  }

  @ApiOperation({
    summary: 'Returns all bookings ever of specified user',
  })
  @ApiResponse({ status: 200, type: [Booking] })
  @Roles('CLIENT', 'ADMIN')
  @UseGuards(RolesAuthGuard)
  @Get('/getAllOfUser/:clientId')
  getAllOfUser(@Param('clientId') clientId: number) {
    return this.bookingsService.getAllBookingsByClientId(clientId);
  }

  @ApiOperation({
    summary: 'Removes booking',
  })
  @ApiResponse({ status: 200, type: String })
  @Roles('CLIENT', 'ADMIN', 'OWNER')
  @UseGuards(RolesAuthGuard)
  @Delete('/remove/:id')
  removeBooking(@Param('id') id: number) {
    return this.bookingsService.removeBooking(id);
  }

  @ApiOperation({
    summary: 'Updates booking',
  })
  @ApiResponse({ status: 200, type: Booking })
  @Roles('CLIENT', 'ADMIN', 'OWNER')
  @UseGuards(RolesAuthGuard)
  @Put('/update/:id')
  updateBooking(@Body() dto: CreateBookingDto, @Param('id') id: number) {
    return this.bookingsService.updateBooking(dto, id);
  }

  @ApiOperation({
    summary: 'Returns all active bookings of required property',
  })
  @ApiResponse({ status: 200, type: [Booking] })
  @Roles('CLIENT', 'ADMIN', 'OWNER')
  @UseGuards(RolesAuthGuard)
  @Get('/allActiveOfProperty/:propertyId')
  getAllActiveBookingsOfProperty(@Param('propertyId') propertyId: number) {
    return this.bookingsService.getAllActiveBookingsOfProperty(propertyId);
  }

  @ApiOperation({
    summary: 'Returns all bookings of required property',
  })
  @ApiResponse({ status: 200, type: [Booking] })
  @Roles('ADMIN', 'OWNER')
  @UseGuards(RolesAuthGuard)
  @Get('/allOfProperty/:propertyId')
  getAllBookingsOfProperty(@Param('propertyId') propertyId: number) {
    return this.bookingsService.getAllBookingsOfProperty(propertyId);
  }

  @ApiOperation({
    summary: 'Returns booking information and changes it status to confirmed',
  })
  @ApiResponse({ status: 200, type: Booking })
  @Roles('ADMIN', 'OWNER')
  @UseGuards(RolesAuthGuard)
  @Put('/confirm/:bookingId')
  confirm(@Param('bookingId') id: number) {
    return this.bookingsService.confirmBooking(id);
  }
}
