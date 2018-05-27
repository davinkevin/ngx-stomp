import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {NgxStompModule} from '@davinkevin/ngx-stomp';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxStompModule.withConfig({
      login: 'login',
      password: 'password',
      url: '/hello',
      debug: true,
      vhost: 'foo',
      headers: {}
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
