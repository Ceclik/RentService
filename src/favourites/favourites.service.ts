import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Favourite } from './favourites.model';
import { Property } from '../properties/properties.model';
import { PropertyImage } from '../descriptions/property-images.model';

@Injectable()
export class FavouritesService {
  constructor(
    @InjectModel(Favourite) private favouriteRepository: typeof Favourite,
  ) {}

  private catchError(e: Error) {
    if (e instanceof BadRequestException)
      throw new BadRequestException(e.message);
    console.log(e);
    throw new InternalServerErrorException();
  }

  async getAllOfUser(clientId: number) {
    try {
      return await this.favouriteRepository.findAll({
        where: { clientId },
        include: [{ model: Property, include: [{ model: PropertyImage }] }],
      });
    } catch (e) {
      this.catchError(e);
    }
  }

  async addToFavourites(clientId: number, propertyId: number) {
    try {
      return await this.favouriteRepository.create({ propertyId, clientId });
    } catch (e) {
      this.catchError(e);
    }
  }

  async removeFromFavourites(clientId: number, propertyId: number) {
    try {
      await this.favouriteRepository.destroy({
        where: { clientId, propertyId },
      });
      return JSON.stringify(
        'Property has been successfully deleted from the favourites list',
      );
    } catch (e) {
      this.catchError(e);
    }
  }
}
