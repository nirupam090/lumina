import { WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class SyncGateway {
  @WebSocketServer()
  server: Server;

  // Native Node in-memory tracker mapping directly to NFR dictates (no Redis overhead)
  private roomTracker: Record<string, string[]> = {};

  handleConnection(roomId: string, userId: string) {
    if (!this.roomTracker[roomId]) {
      this.roomTracker[roomId] = [];
    }

    // Strictly capping mathematical array connections at precisely ~10 entries
    if (this.roomTracker[roomId].length >= 10) {
      throw new WsException('Room capacity exceeded explicit ~10 socket limit');
    }

    this.roomTracker[roomId].push(userId);
  }
}
