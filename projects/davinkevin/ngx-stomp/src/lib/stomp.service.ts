import {Inject, Injectable} from '@angular/core';
import {STOMP_CONFIGURATION, STOMP_JS, StompConfiguration} from './configuration';
import {ConnectableObservable, Observable, OperatorFunction} from 'rxjs';
import {concatMap, map, publishLast, publishReplay, tap} from 'rxjs/operators';
import {DOCUMENT} from '@angular/common';
import {Client, Message} from 'webstomp-client';

export interface Stomp {
  client: (url: string, protocols?: string | Array<string>) => Client;
  over: (ws: WebSocket) => Client;
}

@Injectable()
export class StompService {
  private readonly cl: Client;
  private readonly connection$: Observable<Client>;

  constructor(@Inject(STOMP_CONFIGURATION) private conf: StompConfiguration,
              @Inject(STOMP_JS) private stomp: Stomp,
              @Inject(DOCUMENT) document: any
  ) {
    this.cl = initClient(stomp, this.conf.over, this.conf.url, document.location);
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

function initClient(stomp: Stomp, c: WebSocket, url: string, loc: Location): Client {
  if (c) {
    return stomp.over(c);
  }

  const normalizedUrl = normalizeUrl(url, loc);
  console.log(normalizedUrl);
  return stomp.client(normalizedUrl);
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

function normalizeUrl(url: string, loc: Location): string {
  if (url == null) {
    throw new Error('No url found for web-socket');
  }

  if (url.startsWith('/')) {
    return toWsProtocol(loc.protocol) + '//' + loc.hostname + ':' + loc.port + url;
  }

  try {
    return new URL(url).toString();
  } catch (e) {
    console.error(e);
    throw new Error(`Url with format ${url} not handle for now. Should be complete or start with /`);
  }
}

function toWsProtocol(protocol: string): string {
  return 'http:' === protocol ? 'ws:' : 'wss:';
}
