import { Injectable, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VideoStreamService {
  public recordRTC: any;
  public stream: MediaStream;
}
