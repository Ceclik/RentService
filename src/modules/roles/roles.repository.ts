import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRoleDto } from '@modules/roles/dto/create-role-dto';
import { Role } from '@modules/roles/roles.model';

@Injectable()
export class RolesRepository {
  constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

  async create(dto: CreateRoleDto) {
    return await this.roleRepository.create(dto);
  }

  async getByValue(value: string) {
    return await this.roleRepository.findOne({ where: { value } });
  }

  async deleteByValue(value: string) {
    await this.roleRepository.destroy({ where: { value } });
  }
}
