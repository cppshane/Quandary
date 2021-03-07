import { Injectable, Inject } from '@angular/core';

import { Project } from '../models/project.model';
import { WebSocketMessage } from '../models/web-socket-message.model';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private static socket: WebSocket;

  static startSocket() {
    WebSocketService.socket = new WebSocket('ws://localhost:13000/ws');

    WebSocketService.socket.addEventListener("message", (ev => {
      if (ev.data === '')
        return;

      const webSocketMessage: WebSocketMessage = JSON.parse(ev.data);

      switch (webSocketMessage.Type) {

      }
    }));

    WebSocketService.socket.addEventListener("open", (ev => {
    }));

    WebSocketService.socket.addEventListener("close", (ev => {
      WebSocketService.startSocket();
    }));

    WebSocketService.socket.addEventListener("error", (ev => {
      var retryDelay = 5000;

      setTimeout(WebSocketService.startSocket, retryDelay);
    }));
  }
}
