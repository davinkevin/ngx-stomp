import {ModuleWithProviders, NgModule} from '@angular/core';
import {STOMP_CONFIGURATION, STOMP_JS, StompConfiguration} from './configuration';
import {StompService} from './stomp.service';
import * as webstomp from 'webstomp-client';

export function stompJsFactory() {
  return webstomp;
}

@NgModule({})
export class NgxStompModule {
  static withConfig(config: StompConfiguration): ModuleWithProviders {
    return {
      ngModule: NgxStompModule,
      providers: [
        {provide: STOMP_CONFIGURATION, useValue: config},
        {provide: STOMP_JS, useFactory: stompJsFactory},
        StompService
      ]
    };
  }
}
