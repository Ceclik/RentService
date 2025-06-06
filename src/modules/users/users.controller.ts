import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './users.model';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { BanUserDto } from './dto/ban-user.dto';
import { Roles } from '@common/decorators/roles-auth.decorator';
import { RolesAuthGuard } from '@common/guards/roles-auth.guard';
import { AddUserRoleDto } from './dto/add-user-role.dto';

@ApiTags('Operations with users accounts and access controlling')
@Controller('api/users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiOperation({ summary: 'Returns all created users' })
  @ApiResponse({ status: 200, type: [User] })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('/all')
  getAll() {
    return this.userService.getAllUsers();
  }

  @ApiOperation({ summary: 'Delete users account' })
  @ApiResponse({ status: 200, type: String })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Delete('/delete/:id')
  deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }

  @ApiOperation({ summary: 'Ban users account' })
  @ApiResponse({ status: 200, type: String })
  @Roles('ADMIN')
  @UseGuards(RolesAuthGuard)
  @ApiBearerAuth('access-token')
  @Put('/ban')
  banUser(@Body() dto: BanUserDto) {
    return this.userService.banUser(dto);
  }

  @ApiOperation({ summary: 'Adds roles to users' })
  @ApiResponse({ status: 200, type: String })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Put('/addRole')
  addRoleToUser(@Body() dto: AddUserRoleDto) {
    return this.userService.addRoleToUser(dto);
  }
}
