import {InjectionToken} from '@angular/core';

export const STOMP_CONFIGURATION = new InjectionToken('STOMP_CONFIGURATION');
export interface StompConfiguration {
  login: string|null;
  password: string|null;
  url: string;
  debug: boolean;
  vhost: string;
  headers: any;
  over?: any;
}

export const STOMP_JS = new InjectionToken('STOMP_JS');
