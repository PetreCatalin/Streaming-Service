import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserService } from './services/user.service';
import { LoginComponent } from './login/login.component';
import { VideoComponent } from './video/video.component';

@NgModule({
   declarations: [
      AppComponent,
      LoginComponent,
      VideoComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule
   ],
   providers: [
      UserService
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
