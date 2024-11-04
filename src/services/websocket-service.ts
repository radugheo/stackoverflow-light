import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { WebSocketEventData, WebSocketEvents } from '../types/websocket-types';

export class WebSocketService {
  private static io: SocketServer;

  static initialize(server: HttpServer): void {
    this.io = new SocketServer(server);

    this.io.on('connection', (socket) => {
      console.log('Client connected');

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  }

  static emit<E extends WebSocketEvents>(event: E, data: WebSocketEventData[E]): void {
    if (this.io) {
      this.io.emit(event, data);
    }
  }
}
