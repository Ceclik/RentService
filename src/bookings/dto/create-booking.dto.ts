import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({
    example: 'confirmed',
    description: 'status of the booking',
  })
  readonly status: string;

  @ApiProperty({
    example: '11.03.2025',
    description: 'Start date of the booking',
  })
  readonly startDate: string;

  @ApiProperty({
    example: '11.03.2025',
    description: 'Start date of the booking',
  })
  readonly endDate: string;

  @ApiProperty({ example: '1', description: 'Unique property identifier' })
  readonly propertyId: number;

  @ApiProperty({ example: '1', description: 'Unique client identifier' })
  readonly clientId: number;
}
