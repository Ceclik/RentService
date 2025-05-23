import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { ValidationPipe } from '@common/pipes/validation.pipe';
import { GoogleAuthGuard } from '@common/guards/google-auth/google-auth.guard';

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

  @ApiOperation({
    summary: 'Allows users to login to the system using their google account',
  })
  @ApiResponse({ status: 200, type: String })
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @ApiOperation({
    summary: '?',
  })
  @ApiResponse({ status: 200, type: String })
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  googleCallback(@Req() req) {
    console.log(`request body: ${JSON.stringify(req.user)}`);
    const dto = new CreateUserDto(
      req.user.email,
      req.user.password,
      req.user.oauthId,
      req.user.oauthProvider,
    );
    return this.authService.login(dto);
  }
}
