import { Module } from '@nestjs/common';
import { FavouritesController } from './favourites.controller';
import { FavouritesService } from './favourites.service';
import { AuthModule } from '../auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Favourite } from './favourites.model';
import { Property } from '../properties/properties.model';
import { PropertyImage } from '../descriptions/property-images.model';

@Module({
  controllers: [FavouritesController],
  providers: [FavouritesService],
  imports: [
    AuthModule,
    SequelizeModule.forFeature([Favourite, Property, PropertyImage]),
  ],
})
export class FavouritesModule {}
