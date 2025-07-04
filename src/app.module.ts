import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '@modules/users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@modules/users/users.model';
import { RolesModule } from '@modules/roles/roles.module';
import * as process from 'node:process';
import { Role } from '@modules/roles/roles.model';
import { UserRoles } from '@modules/roles/user-roles.model';
import { AuthModule } from '@modules/auth/auth.module';
import { PropertiesModule } from '@modules/properties/properties.module';
import { TypesModule } from '@modules/types/types.module';
import { Property } from '@modules/properties/properties.model';
import { Description } from '@modules/descriptions/descriptions.model';
import { Type } from '@modules/types/types.model';
import { PropertyImage } from '@modules/descriptions/property-images.model';
import { FilesModule } from '@modules/files/files.module';
import { BookingsModule } from '@modules/bookings/bookings.module';
import { Booking } from '@modules/bookings/bookings.model';
import { ContractsModule } from '@modules/contracts/contracts.module';
import { Contract } from '@modules/contracts/contracts.model';
import { ScheduleModule } from '@nestjs/schedule';
import { FavouritesModule } from '@modules/favourites/favourites.module';
import { Favourite } from '@modules/favourites/favourites.model';
import { ReviewsModule } from '@modules/reviews/reviews.module';
import { Review } from '@modules/reviews/rewiews.model';
import { ReviewImage } from '@modules/reviews/review-images.model';
import { AnalyticsModule } from '@modules/analytics/analytics.module';
import { Analytics } from '@modules/analytics/analytics.model';
import { ChatModule } from '@modules/chat/chat.module';
import { Message } from '@modules/chat/messages/messages.model';
import { Chat } from '@modules/chat/chat.model';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MinioModule } from '@modules/minio/minio.module';
import { MinioController } from '@modules/minio/minio.controller';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
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
        Analytics,
        Message,
        Chat,
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
    AnalyticsModule,
    ChatModule,
    MinioModule,
  ],
  controllers: [MinioController],
})
export class AppModule {}
