import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/users.model';
import { RolesModule } from './roles/roles.module';
import * as process from 'node:process';
import { Role } from './roles/roles.model';
import { UserRoles } from './roles/user-roles.model';
import { AuthModule } from './auth/auth.module';
import { PropertiesModule } from './properties/properties.module';
import { TypesModule } from './types/types.module';
import { Property } from './properties/properties.model';
import { Description } from './descriptions/descriptions.model';
import { Type } from './types/types.model';
import { PropertyImage } from './descriptions/property-images.model';
import { FilesModule } from './files/files.module';
import { BookingsModule } from './bookings/bookings.module';
import { Booking } from './bookings/bookings.model';
import { ContractsModule } from './contracts/contracts.module';
import { Contract } from './contracts/contracts.model';
import { ScheduleModule } from '@nestjs/schedule';
import { FavouritesModule } from './favourites/favourites.module';
import { Favourite } from './favourites/favourites.model';
import { ReviewsModule } from './reviews/reviews.module';
import { Review } from './reviews/rewiews.model';
import { ReviewImage } from './reviews/review-images.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    UsersModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [
        User,
        Role,
        UserRoles,
        Property,
        Type,
        Description,
        PropertyImage,
        Booking,
        Contract,
        Favourite,
        Review,
        ReviewImage,
      ],
      autoLoadModels: true,
      synchronize: true,
    }),
    RolesModule,
    AuthModule,
    PropertiesModule,
    TypesModule,
    FilesModule,
    BookingsModule,
    ContractsModule,
    ScheduleModule.forRoot(),
    FavouritesModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
