import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Favourite } from '@modules/favourites/favourites.model';
import { Property } from '@modules/properties/properties.model';
import { PropertyImage } from '@modules/descriptions/property-images.model';

@Injectable()
export class FavouritesRepository {
  constructor(
    @InjectModel(Favourite) private favouriteRepository: typeof Favourite,
  ) {}

  async findAllOfClient(clientId: number) {
    return await this.favouriteRepository.findAll({
      where: { clientId },
      include: [{ model: Property, include: [{ model: PropertyImage }] }],
    });
  }

  async addToFavourites(propertyId: number, clientId: number) {
    await this.favouriteRepository.create({ propertyId, clientId });
  }

  async removeFromFavourites(clientId: number, propertyId: number) {
    await this.favouriteRepository.destroy({
      where: { clientId, propertyId },
    });
  }
}
