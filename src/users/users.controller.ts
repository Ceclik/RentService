import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/add')
  create(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @Get('/all')
  getAll() {
    return this.userService.getAllUsers();
  }
}
