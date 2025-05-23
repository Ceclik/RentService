import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.model';
import { Chat } from './chat.model';

interface MessageCreationAttrs {
  message: string;
  senderId: number;
  receiverId: number;
  chatid: number;
}

@Table({ tableName: 'messages' })
export class Message extends Model<Message, MessageCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'Hello world!',
    description: 'Text of the sent message!',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  message: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  senderId: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  receiverId: number;

  @ForeignKey(() => Chat)
  @Column({ type: DataType.INTEGER, allowNull: false })
  chatid: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Chat, { onDelete: 'CASCADE' })
  chat: Chat;
}
