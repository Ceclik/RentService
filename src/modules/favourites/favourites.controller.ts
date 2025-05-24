import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@common/decorators/roles-auth.decorator';
import { RolesAuthGuard } from '@common/guards/roles-auth.guard';
import { FavouritesService } from './favourites.service';
import { Favourite } from './favourites.model';
import { User } from '@modules/users/users.model';
import { context, CONTEXT_KEYS } from '@common/cls/request-context';

@ApiTags('Operations with list of favourite properties')
@Controller('api/favourites')
export class FavouritesController {
  constructor(private favouritesService: FavouritesService) {}

  @ApiOperation({
    summary: 'Returns all properties added to favourites by required user',
  })
  @ApiResponse({ status: 200, type: Favourite })
  @Roles('ADMIN', 'CLIENT')
  @UseGuards(RolesAuthGuard)
  @Get('/all')
  confirm() {
    const user: User = context.get(CONTEXT_KEYS.USER);
    const userId: number = user.id;
    return this.favouritesService.getAllOfUser(userId);
  }

  @ApiOperation({
    summary: 'Adds property to required user favourites list',
  })
  @ApiResponse({ status: 200, type: Favourite })
  @Roles('ADMIN', 'CLIENT')
  @UseGuards(RolesAuthGuard)
  @Post('/add/:propertyId')
  addToFavourites(@Param('propertyId') propertyId: number) {
    const user: User = context.get(CONTEXT_KEYS.USER);
    const userId: number = user.id;
    return this.favouritesService.addToFavourites(userId, propertyId);
  }

  @ApiOperation({
    summary: 'Removes property from required user favourites list',
  })
  @ApiResponse({ status: 200, type: String })
  @Roles('ADMIN', 'CLIENT')
  @UseGuards(RolesAuthGuard)
  @Delete('/delete/:propertyId')
  removeFromFavourites(@Param('propertyId') propertyId: number) {
    const user: User = context.get(CONTEXT_KEYS.USER);
    const userId: number = user.id;
    return this.favouritesService.removeFromFavourites(userId, propertyId);
  }
}
