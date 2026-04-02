// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // <-- required for ngModel
import { RouterModule } from '@angular/router';

import { App } from './app'; // your app.ts root component
import { VerifyOtpComponent } from './pages/verify-otp/verify-otp.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { routes } from './app.routes';

@NgModule({
  declarations: [
    App,
    VerifyOtpComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,          
    RouterModule.forRoot(routes)
  ],
  bootstrap: [App]
})
export class AppModule {}