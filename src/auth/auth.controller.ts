import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { ValidationPipe } from '../pipes/validation.pipe';

@ApiTags('Authorization operations')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Authorizes user in system, returns JWT' })
  @ApiResponse({ status: 200, type: String })
  @UsePipes(ValidationPipe)
  @Post('login')
  login(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto);
  }

  @ApiOperation({ summary: 'Creates user account in system, returns JWT' })
  @ApiResponse({ status: 200, type: String })
  @UsePipes(ValidationPipe)
  @Post('registration')
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.register(userDto);
  }
}
