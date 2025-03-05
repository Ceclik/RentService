import { ApiProperty } from '@nestjs/swagger';

export class AddUserRoleDto {
  @ApiProperty({
    example: '3',
    description: 'id of user that needed to add role',
  })
  readonly id: number;

  @ApiProperty({
    example: 'client',
    description: 'role name',
  })
  readonly value: string;
}
