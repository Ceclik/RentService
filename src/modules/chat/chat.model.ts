import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.model';
import { Message } from './messages.model';

interface ChatCreationAttrs {
  user1Id: number;
  user2Id: number;
}

@Table({ tableName: 'chats' })
export class Chat extends Model<Chat, ChatCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  user1Id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  user2Id: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Message)
  messages: Message[];
}
