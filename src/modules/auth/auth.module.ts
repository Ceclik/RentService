import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'node:process';
import { ConfigModule } from '@nestjs/config';
import googleOauthConfig from 'config/google-oauth.config';
import { GoogleStrategy } from '@common/strategies/google.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.SECRET_KEY || 'VERYSECRETKEY',
      signOptions: {
        expiresIn: '12h',
      },
    }),
    ConfigModule.forFeature(googleOauthConfig),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
