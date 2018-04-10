import {Component, OnInit} from '@angular/core';
import {map, tap, take} from 'rxjs/operators';
import {StompService} from '../lib/ngx-stomp';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  template: `
    <!--The content below is only a placeholder and can be replaced.-->

    <h2>Messages comming from server </h2>
    <div>
      <button (click)="closeSocketFromServer()">Loose connection from server</button>
    </div>
    <br>
    <div>
      <button (click)="connectFromClient()">Open from Client</button>
      <button (click)="subscribeToSubject()">Subscribe from GUI</button>
      <button (click)="closeSocketFromClient()">Close from Client</button>
    </div>
    <br>
    <div>
      <button (click)="clearAll()">Clear all Messages</button>
    </div>
    <br>

    <div style="text-align:center; width: 50%; float: left">
      <div>
        <p>Hello</p>
        <div>
          <button (click)="openTopicHello()">Open</button>
        </div>
        <ul>
          <li *ngFor="let h of helloMessages"> {{ h }} </li>
        </ul>
      </div>
    </div>
    <div style="text-alignter; width: 50%; float: left">
      <div>
        <p>Good Bye</p>
        <div>
          <button (click)="openTopicGoodBye()">Open</button>
        </div>
        <ul>
          <li *ngFor="let h of goodBye"> {{ h }} </li>
        </ul>
      </div>
    </div>
  `,
  styles: []
})
export class AppComponent implements OnInit {

  helloMessages: string[] = [];
  goodBye: string[] = [];

  constructor(private stompService: StompService, private http: HttpClient) {}

  ngOnInit(): void {
  }

  closeSocketFromServer() {
    return this.http.get<void>('/closeAll').subscribe();
  }

  connectFromClient() {
    return false;
  }
  subscribeToSubject() {
    return false;
  }
  closeSocketFromClient() {
    return false;
  }

  openTopic(topic: string) {
    return this.stompService.on<WsMessage>(topic)
      .pipe(
        map((v: WsMessage) => v.body),
        tap(console.log,console.log,console.log),
        take(5),
      );
  }

  openTopicHello() {
    this.openTopic('/topic/hello')
      .subscribe(v => this.helloMessages = [...this.helloMessages, v]);
  }

  openTopicGoodBye() {
    this.openTopic('/topic/goodbye')
      .subscribe(v => this.goodBye = [...this.goodBye, v]);
  }

  clearAll() {
    this.helloMessages = [];
    this.goodBye = [];
  }
}

interface WsMessage {
  id: number;
  body: string;
}
