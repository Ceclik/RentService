import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/users.model';
import { Chat } from '../chat.model';
import { BOOLEAN } from 'sequelize';

interface MessageCreationAttrs {
  message: string;
  senderId: number;
  receiverId: number;
  chatid: number;
  hasdelivered: boolean;
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
  @Column({ type: DataType.INTEGER })
  senderId: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  receiverId: number;

  @ForeignKey(() => Chat)
  @Column({ type: DataType.INTEGER, allowNull: false })
  chatid: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: 'false' })
  hasdelivered: boolean;
  // Ассоциация для отправителя
  @BelongsTo(() => User, {
    foreignKey: 'senderId',
    as: 'sender',
    onDelete: 'SET NULL',
  })
  sender: User;

  // Ассоциация для получателя
  @BelongsTo(() => User, {
    foreignKey: 'receiverId',
    as: 'receiver',
    onDelete: 'SET NULL',
  })
  receiver: User;

  @BelongsTo(() => Chat, { onDelete: 'CASCADE' })
  chat: Chat;
}
