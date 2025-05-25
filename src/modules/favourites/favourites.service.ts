import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { FavouritesRepository } from '@modules/favourites/favourites.repository';

@Injectable()
export class FavouritesService {
  constructor(private favouritesRepository: FavouritesRepository) {}

  private catchError(e: Error) {
    if (e instanceof BadRequestException)
      throw new BadRequestException(e.message);
    console.log(e);
    throw new InternalServerErrorException();
  }

  async getAllOfUser(clientId: number) {
    try {
      return await this.favouritesRepository.findAllOfClient(clientId);
    } catch (e) {
      this.catchError(e);
    }
  }

  async addToFavourites(clientId: number, propertyId: number) {
    try {
      return await this.favouritesRepository.addToFavourites(clientId, propertyId);
    } catch (e) {
      this.catchError(e);
    }
  }

  async removeFromFavourites(clientId: number, propertyId: number) {
    try {
      await this.favouritesRepository.removeFromFavourites(clientId, propertyId);
      return JSON.stringify(
        'Property has been successfully deleted from the favourites list',
      );
    } catch (e) {
      this.catchError(e);
    }
  }
}
