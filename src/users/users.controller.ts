import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './users.model';

@ApiTags('Operations with users accounts and access controlling')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiOperation({ summary: 'Creates user' })
  @ApiResponse({ status: 200, type: User })
  @Post('/add')
  create(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @ApiOperation({ summary: 'Returns all created users' })
  @ApiResponse({ status: 200, type: [User] })
  @Get('/all')
  getAll() {
    return this.userService.getAllUsers();
  }

  @ApiOperation({ summary: 'Delete users account' })
  @ApiResponse({ status: 200, type: String })
  @Delete('/delete/:id')
  deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }
}
