import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role-dto';
import { RolesRepository } from '@modules/roles/roles.repository';

@Injectable()
export class RolesService {
  constructor(private rolesRepository: RolesRepository) {}

  async createRole(dto: CreateRoleDto) {
    const createdRole = await this.rolesRepository.create(dto);
    if (!createdRole) throw Error('Internal');
    return createdRole;
  }

  async getRoleByValue(value: string) {
    const foundRole = await this.rolesRepository.getByValue(value);
    if (!foundRole) return JSON.stringify('Not found!');
    return foundRole;
  }

  async deleteRoleByValue(value: string) {
    try {
      await this.rolesRepository.deleteByValue(value);
      return JSON.stringify('Chosen role has been successfully deleted!');
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
