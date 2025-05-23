import { ApiProperty } from '@nestjs/swagger';

export class BanUserDto {
  @ApiProperty({
    example: '3',
    description: 'id of user that should be banned',
  })
  readonly id: number;

  @ApiProperty({
    example: 'Scamming',
    description: 'reason of banning user',
  })
  readonly reason: string;
}
