import {ModuleWithProviders, NgModule} from '@angular/core';
import {STOMP_CONFIGURATION, STOMP_JS, StompConfiguration} from './configuration';
import {StompService} from './stomp.service';
import * as StompJS from 'stompjs';

export function stompJsFactory() {
  return StompJS;
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
