import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    example: 'client',
    description: 'role name',
  })
  readonly value: string;

  @ApiProperty({
    example: 'Clients can watch available offers, book, etc. ',
    description: 'Information about what users of this role can do',
  })
  readonly description: string;
}
