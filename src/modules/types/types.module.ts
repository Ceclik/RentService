import { forwardRef, Module } from '@nestjs/common';
import { TypesController } from './types.controller';
import { TypesService } from './types.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Type } from './types.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [TypesController],
  providers: [TypesService],
  imports: [SequelizeModule.forFeature([Type]), forwardRef(() => AuthModule)],
  exports: [TypesService],
})
export class TypesModule {}
