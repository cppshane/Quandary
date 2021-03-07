import { Component } from '@angular/core';

import { WebSocketService } from '../../services/web-socket.service';

declare const randomColor: any;

@Component({
  selector: 'app-intelligence',
  templateUrl: './intelligence.component.html',
  styleUrls: ['./intelligence.component.css']
})
export class IntelligenceComponent {
  constructor() {
    WebSocketService.startSocket();
  }
}
