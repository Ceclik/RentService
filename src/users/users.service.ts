import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '../roles/roles.model';
import { RolesService } from '../roles/roles.service';
import { BanUserDto } from './dto/ban-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private roleService: RolesService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const transaction = await this.userRepository.sequelize?.transaction();
    try {
      const createdUser = await this.userRepository.create(dto, {
        transaction,
      });

      const role = await this.roleService.getRoleByValue('CLIENT');
      if (role instanceof Role) {
        await createdUser.$set('roles', role.id, { transaction });
        createdUser.roles = [role];
      }
      if (transaction) await transaction.commit();
      return createdUser;
    } catch (err) {
      if (transaction) await transaction.rollback();
      throw err;
    }
  }

  async getUsersByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll({ include: { all: true } });
    if (!users)
      throw new HttpException('internal', HttpStatus.INTERNAL_SERVER_ERROR);
    return users;
  }

  async deleteUser(id: number) {
    await this.userRepository.destroy({ where: { id } });
    return JSON.stringify('User has been successfully deleted!');
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

    return JSON.stringify('Selected user has been successfully banned!');
  }
}
