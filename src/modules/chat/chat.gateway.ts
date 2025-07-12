import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/users.model';
import { ChatService } from './chat.service';

@WebSocketGateway(5000, { cors: { origin: '*' } })
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
  ) {}

  @WebSocketServer() private server: Server;
  private users = new Map<number, string>();

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        console.log('No token provided');
        client.disconnect();
        return;
      }

      const user: User = this.jwtService.verify(token);
      (client as any).user = user;

      this.users.set(user.id, client.id);
      console.log(`User ${user.id} connected with socket ${client.id}`);

      const messages = await this.chatService.getAllUnreadMessagesOfUser(
        user.id,
      );

      if (messages.length > 0) {
        messages.forEach((message) => {
          this.emitMessage(client.id, message.senderId, {
            toUserId: message.receiverId,
            message: message.message,
          });
        });
      }
    } catch (err) {
      console.log('Invalid token:', err.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.getUserIdBySocket(client.id);
    if (userId) {
      this.users.delete(userId);
      console.log(`User ${userId} disconnected`);
    }
  }

  private emitMessage(
    recipientSocketId: string,
    senderId: number,
    data: { toUserId: number; message: string },
  ) {
    this.server
      .to(recipientSocketId)
      .emit('reply', JSON.stringify({ senderId, message: data.message }));
    console.log(
      `Message sent to user ${data.toUserId}, with socket id: ${recipientSocketId}: ${data.message}`,
    );
  }

  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    data: { toUserId: number; message: string },
  ) {
    let recipientSocketId: string = '';
    let receiverId: number = 0;

    for (const user of this.users) {
      if (user[0] === data.toUserId) {
        receiverId = user[0];
        recipientSocketId = user[1];
      }
    }

    if (recipientSocketId.length > 0) {
      await this.saveMessageToDB(data, client, true);
      const senderId = this.getUserIdBySocket(client.id);
      this.emitMessage(recipientSocketId, senderId, data);
    } else {
      console.log(`User ${data.toUserId} is not connected.`);
      await this.saveMessageToDB(data, client, false);
    }
  }

  private async saveMessageToDB(
    data: {
      toUserId: number;
      message: string;
    },
    client: Socket,
    hasdelivered: boolean,
  ) {
    console.log(
      `message data while saving to db: senderId: ${(client as any).user.id}, receiverId: ${data.toUserId}, message: ${data.message}`,
    );
    await this.chatService.createMessage({
      message: data.message,
      senderId: (client as any).user.id,
      receiverId: data.toUserId,
      hasdelivered,
    });
  }

  private getUserIdBySocket(socketId: string): number {
    for (const [userId, id] of this.users.entries()) {
      if (id === socketId) return userId;
    }
    return 0;
  }
}
