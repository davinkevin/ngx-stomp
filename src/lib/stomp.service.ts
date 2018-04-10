import {Inject, Injectable} from '@angular/core';
import {STOMP_CONFIGURATION, STOMP_JS, StompConfiguration} from './configuration';
import {Client, Message} from 'stompjs';
import {Observable} from 'rxjs/Observable';
import {concatMap, map, publishReplay} from 'rxjs/operators';
import {OperatorFunction} from 'rxjs/interfaces';
import {ConnectableObservable} from 'rxjs/observable/ConnectableObservable';


@Injectable()
export class StompService {
  private readonly cl: Client;
  private readonly connection$: Observable<Client>;

  constructor(@Inject(STOMP_CONFIGURATION) private conf: StompConfiguration,
              @Inject(STOMP_JS) private Stomp: any) {

    this.cl = initClient(Stomp, this.conf.over, this.conf.url);
    this.cl.debug = initDebug(this.conf.debug);

    this.connection$ = initConnection(this.cl, this.conf);
  }

  on<T>(topic: string): Observable<T> {
    return this.connection$.pipe(
      onTopic(topic),
      toJSON()
    );
  }
}

function onTopic(topic: string): OperatorFunction<Client, Message> {
  return concatMap((c: Client) => Observable.create(observer => {

    const subscription = c.subscribe(topic, v => observer.next(v), {});

    return () => {
      subscription.unsubscribe();
    };
  }));
}

function toJSON<T>(): OperatorFunction<Message, T> {
  return map((m: Message) => JSON.parse(m.body));
}

function initClient(Stomp: any, c: any, url: string): Client {
  return c ? Stomp.over(c) : Stomp.client(url);
}

function initDebug(isActivated: boolean) {
  return isActivated ? console.log : () => {};
}

function initConnection(client: Client, config: StompConfiguration): Observable<Client> {
  const c$: ConnectableObservable<Client> = Observable.create(obs => {
    client.connect(config.login, config.password,
      () => obs.next(client),
      e => obs.error(e),
      config.vhost
    );
  })
    .pipe(publishReplay(1));

  c$.connect();

  return c$;
}
