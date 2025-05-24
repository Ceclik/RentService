import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '@common/decorators/roles-auth.decorator';
import { RolesAuthGuard } from '@common/guards/roles-auth.guard';
import { ReviewsService } from './reviews.service';
import { Review } from './rewiews.model';
import { CreateReviewDto } from './dto/create-review.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Operations with reviews on properties')
@ApiBearerAuth('access-token')
@Controller('api/reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @ApiOperation({
    summary: 'Returns all reviews added of required property',
  })
  @ApiResponse({ status: 200, type: [Review] })
  @Roles('ADMIN', 'CLIENT', 'OWNER')
  @UseGuards(RolesAuthGuard)
  @Get('/allForProperty/:propertyId')
  getAllForProperty(@Param('propertyId') propertyid: number) {
    return this.reviewsService.getAllOfProperty(propertyid);
  }

  @ApiOperation({
    summary: 'Returns all reviews added of required client',
  })
  @ApiResponse({ status: 200, type: [Review] })
  @Roles('ADMIN', 'CLIENT', 'OWNER')
  @UseGuards(RolesAuthGuard)
  @Get('/allFromUser/:clientId')
  getAllFromUser(@Param('clientId') clientId: number) {
    return this.reviewsService.getAllFromClient(clientId);
  }

  @ApiOperation({
    summary: 'Adds new review from client',
  })
  @ApiResponse({ status: 200, type: Review })
  @Roles('ADMIN', 'CLIENT')
  @UseGuards(RolesAuthGuard)
  @UseInterceptors(FilesInterceptor('images'))
  @Post('/add')
  addReview(@Body() dto: CreateReviewDto, @UploadedFiles() images) {
    return this.reviewsService.addReview(dto, images);
  }

  @ApiOperation({
    summary: 'Updates required review',
  })
  @ApiResponse({ status: 200, type: Review })
  @Roles('ADMIN', 'CLIENT')
  @UseGuards(RolesAuthGuard)
  @UseInterceptors(FilesInterceptor('images'))
  @Put('/update/:reviewId')
  updateReview(
    @Body() dto: CreateReviewDto,
    @UploadedFiles() images,
    @Param('reviewId') reviewId: number,
  ) {
    return this.reviewsService.updateReview(dto, images, reviewId);
  }

  @ApiOperation({
    summary: 'Removes review',
  })
  @ApiResponse({ status: 200, type: String })
  @Roles('ADMIN', 'CLIENT')
  @UseGuards(RolesAuthGuard)
  @Delete('/delete/:reviewId')
  removeFromFavourites(@Param('reviewId') reviewId: number) {
    return this.reviewsService.removeReview(reviewId);
  }
}
