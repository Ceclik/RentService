import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    example: '4',
    description: 'Amount of stars user can give to an apartment',
  })
  rating: number;

  @ApiProperty({
    example: 'Very good apartment, liked everything!',
    description: 'Content of the users review',
  })
  review: string;

  @ApiProperty({
    example: '5',
    description: 'Unique property identifier',
  })
  propertyId: number;

  @ApiProperty({
    example: '5',
    description: 'Unique client identifier',
  })
  clientId: number;
}
