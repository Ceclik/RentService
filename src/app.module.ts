import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import * as process from 'node:process';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/users.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    UsersModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '44587001',
      database: 'rentService',
      models: [User],
      autoLoadModels: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
