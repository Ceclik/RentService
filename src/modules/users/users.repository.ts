import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { User } from '@modules/users/users.model';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from '@modules/roles/roles.model';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { Transaction } from 'sequelize';
import { RolesService } from '@modules/roles/roles.service';
import { BanUserDto } from '@modules/users/dto/ban-user.dto';
import { AddUserRoleDto } from '@modules/users/dto/add-user-role.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private roleService: RolesService,
  ) {}

  async createTransaction() {
    return await this.userRepository.sequelize?.transaction();
  }

  async createUser(dto: CreateUserDto, transaction: Transaction) {
    const createdUser = await this.userRepository.create(dto, {
      transaction,
    });

    const role = await this.roleService.getRoleByValue('CLIENT');
    if (role instanceof Role) {
      await createdUser.$set('roles', role.id, { transaction });
      createdUser.roles = [role];
    }
    return createdUser;
  }

  async getByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
  }

  async getAll() {
    return await this.userRepository.findAll({ include: { all: true } });
  }

  async deleteUser(id: number) {
    await this.userRepository.destroy({ where: { id } });
  }

  async banUser(dto: BanUserDto) {
    const user = await this.userRepository.findByPk(dto.id);
    if (!user || user.banned)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    else {
      user.banned = true;
      user.ban_reason = dto.reason;
      await user.save();
    }
  }

  async addRole(dto: AddUserRoleDto) {
    const user = await this.userRepository.findByPk(dto.id);
    const role = await this.roleService.getRoleByValue(dto.value);

    if (user && role && role instanceof Role) {
      await user.$add('role', role.id);
      return dto;
    }
    throw new BadRequestException({ message: 'user or role does not exist' });
  }
}
