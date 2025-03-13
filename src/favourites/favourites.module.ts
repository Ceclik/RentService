import { Module } from '@nestjs/common';
import { FavouritesController } from './favourites.controller';
import { FavouritesService } from './favourites.service';
import { AuthModule } from '../auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Favourite } from './favourites.model';
import { Property } from '../properties/properties.model';

@Module({
  controllers: [FavouritesController],
  providers: [FavouritesService],
  imports: [AuthModule, SequelizeModule.forFeature([Favourite, Property])],
})
export class FavouritesModule {}
