import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/users.model';
import { ChatService } from './chat.service';

@WebSocketGateway(5000, { cors: { origin: '*' } })
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private chatService: ChatService,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  @WebSocketServer() private server: Server;
  private users = new Map<number, string>();
  private senderId: number;

  handleConnection(client: Socket) {
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
      this.senderId = user.id;
      console.log(`User ${user.id} connected with socket ${client.id}`);
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

  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    data: { toUserId: number; message: string },
  ) {
    let recipientSocketId: string = '';
    let receiverId: number = 0;
    console.log('All registered and connected users: ');
    for (const user of this.users) {
      console.log(
        `User id: ${user[0]}, userId type: ${typeof user[0]}, user socket: ${user[1]}, to user id: ${data.toUserId}`,
      );
      if (user[0] === data.toUserId) {
        receiverId = user[0];
        recipientSocketId = user[1];
      }
    }

    if (recipientSocketId.length > 0) {
      await this.chatService.createMessage({
        message: data.message,
        senderId: (client as any).user.id,
        receiverId,
      });
      this.server.to(recipientSocketId).emit('reply', data.message);
      console.log(`Message sent to user ${data.toUserId}: ${data.message}`);
    } else {
      console.log(`User ${data.toUserId} is not connected`);
    }
  }

  private getUserIdBySocket(socketId: string): number | undefined {
    for (const [userId, id] of this.users.entries()) {
      if (id === socketId) return userId;
    }
    return undefined;
  }
}
