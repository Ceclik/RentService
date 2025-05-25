import { forwardRef, Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { AuthModule } from '../auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from './messages/messages.model';
import { ChatGateway } from './chat.gateway';
import { UsersModule } from '../users/users.module';
import { User } from '../users/users.model';
import { Chat } from './chat.model';
import { JwtModule } from '@nestjs/jwt';
import { ChatRepository } from '@modules/chat/chat.repository';
import { MessageRepository } from '@modules/chat/messages/message.repository';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, ChatRepository, MessageRepository],
  imports: [
    AuthModule,
    SequelizeModule.forFeature([Message, User, Chat]),
    UsersModule,
    forwardRef(() => AuthModule),
    JwtModule,
  ],
})
export class ChatModule {}
