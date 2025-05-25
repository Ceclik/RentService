import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Type } from '@modules/types/types.model';

@Injectable()
export class TypesRepository {
  constructor(@InjectModel(Type) private typesRepository: typeof Type) {}

  async findById(id: number) {
    return await this.typesRepository.findByPk(id);
  }
}
