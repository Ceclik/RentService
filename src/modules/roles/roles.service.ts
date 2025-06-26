import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './roles.model';
import { CreateRoleDto } from './dto/create-role-dto';
import { RolesRepository } from '@modules/roles/roles.repository';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role) private roleRepository: typeof Role,
    private roleRep: RolesRepository,
  ) {}

  async createRole(dto: CreateRoleDto) {
    const createdRole = await this.roleRep.create(dto);
    if (!createdRole) throw Error('Internal');
    return createdRole;
  }

  async getRoleByValue(value: string) {
    const foundRole = await this.roleRep.getByValue(value);
    if (!foundRole) return JSON.stringify('Not found!');
    return foundRole;
  }

  async deleteRoleByValue(value: string) {
    try {
      await this.roleRep.deleteByValue(value);
      return JSON.stringify('Chosen role has been successfully deleted!');
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
