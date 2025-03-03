import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './roles.model';
import { CreateRoleDto } from './dto/create-role-dto';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

  async createRole(dto: CreateRoleDto) {
    const createdRole = await this.roleRepository.create(dto);
    if (!createdRole) throw Error('Internal');
    return createdRole;
  }

  async getRoleByValue(value: string) {
    const foundRole = await this.roleRepository.findOne({ where: { value } });
    if (!foundRole) return JSON.stringify('Not found!');
    return foundRole;
  }
}
