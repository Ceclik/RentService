import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'node:process';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY || 'VERYSECRETKEY',
      signOptions: {
        expiresIn: '12h',
      },
    }),
  ],
})
export class AuthModule {}
