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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './users.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BanUserDto } from './dto/ban-user.dto';
import { Roles } from '../auth/roles-auth.decorator';
import { RolesAuthGuard } from '../auth/roles-auth.guard';

@ApiTags('Operations with users accounts and access controlling')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiOperation({ summary: 'Returns all created users' })
  @ApiResponse({ status: 200, type: [User] })
  @UseGuards(JwtAuthGuard)
  @Get('/all')
  getAll() {
    return this.userService.getAllUsers();
  }

  @ApiOperation({ summary: 'Delete users account' })
  @ApiResponse({ status: 200, type: String })
  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:id')
  deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }

  @ApiOperation({ summary: 'Ban users account' })
  @ApiResponse({ status: 200, type: String })
  @Roles('ADMIN')
  @UseGuards(RolesAuthGuard)
  @Put('/ban')
  banUser(@Param('id') id: number, @Body() dto: BanUserDto) {
    return this.userService.banUser(dto);
  }
}
