import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    example: '4',
    description: 'Amount of stars user can give to an apartment',
  })
  @IsNumber({}, { message: 'must be a number' })
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    example: 'Very good apartment, liked everything!',
    description: 'Content of the users review',
  })
  @IsString({ message: 'Review must be a string!' })
  @IsNotEmpty({ message: 'Review could not be empty!' })
  review: string;

  @ApiProperty({
    example: '5',
    description: 'Unique property identifier',
  })
  @IsNumber()
  propertyId: number;

  @ApiProperty({
    example: '5',
    description: 'Unique client identifier',
  })
  @IsNumber()
  clientId: number;
}
