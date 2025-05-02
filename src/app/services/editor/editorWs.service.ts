import { Injectable } from '@angular/core';
import { Client, StompSubscription } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditorWsService {
  private wsUrl: string = "ws://localhost:8081/code-output";
  private contentSubject = new BehaviorSubject<string>('');
  public content$ = this.contentSubject.asObservable();
  public connectionStatus$ = new BehaviorSubject<boolean>(false);
  private currentSubscription: StompSubscription | undefined;

  private client = new Client({
    brokerURL: this.wsUrl,
    onStompError(frame) {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    },
    onWebSocketError: error=>{
      console.error('Error with websocket', error);
    }
  });

  //maitain one connection
  connect() {
    if(this.client.connected){
      this.connectionStatus$.next(true);
      return;
    } 

    this.client.onConnect = () => this.connectionStatus$.next(true);
    this.client.activate();
  }

  //call this when app closes, to cut the connection
  disconnect() {
    this.client.onDisconnect = () => this.connectionStatus$.next(false);
    if(this.client.active) this.client.deactivate;
    console.log("Disconnected");
  }


  //subscribe to new id, without making new connection
 //make sure to unsubscribe old subscription when making new subscription
  subscribe(id: string){
    if(this.currentSubscription) this.currentSubscription.unsubscribe();
    if(id){
      this.currentSubscription = this.client.subscribe('queue/response/' + id , message => {
          this.contentSubject.next(message.body); 
      });
    }else{
      console.log('Subscription failed: null id');
    }
  }
}