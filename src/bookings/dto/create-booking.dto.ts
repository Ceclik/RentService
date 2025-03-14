import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    example: '11.03.2025',
    description: 'Start date of the booking',
  })
  @IsString({ message: 'Date must be a string!' })
  readonly startDate: string;

  @ApiProperty({
    example: '11.03.2025',
    description: 'Start date of the booking',
  })
  @IsString({ message: 'Date must be a string!' })
  readonly endDate: string;

  @ApiProperty({ example: '1', description: 'Unique property identifier' })
  @IsNumber()
  readonly propertyId: number;

  @ApiProperty({ example: '1', description: 'Unique client identifier' })
  @IsNumber()
  readonly clientId: number;
}
