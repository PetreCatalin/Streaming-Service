import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserService } from './services/user.service';
import { LoginComponent } from './login/login.component';
import { VideoComponent } from './video/video.component';
import { ActiveUsersComponent } from './active-users/active-users.component';
import { SocketService } from './services/socket.service';

@NgModule({
   declarations: [
      AppComponent,
      LoginComponent,
      VideoComponent,
      ActiveUsersComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule
   ],
   providers: [
      UserService,
      SocketService
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
