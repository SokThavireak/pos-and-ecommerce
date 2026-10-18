import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AppGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  broadcastThemeUpdate(themeData: {
    colorPrimary: string;
    colorSecondary: string;
    colorSurface: string;
    logoUrl?: string;
    storeName?: string;
  }) {
    if (this.server) {
      this.server.emit('theme:updated', themeData);
    }
  }

  broadcastInventoryUpdate(data: { productId: string; newStock: number }) {
    if (this.server) {
      this.server.emit('inventory:updated', data);
    }
  }

  broadcastOrderUpdate(order: any) {
    if (this.server) {
      this.server.emit('order:updated', order);
    }
  }
}
