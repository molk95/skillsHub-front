import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpErrorInterceptor } from './core/interceptors/http-error.interceptor';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { WalletsModule } from './features/wallets/wallets.module';
import { DashboardPageComponent } from './features/dashboard/dashboard-page/dashboard-page.component';
import { NavbarComponent } from './features/layout/navbar/navbar.component';
import { SidebarComponent } from './features/layout/sidebar/sidebar.component';
import { LandingPageComponent } from './features/landing-page/landing-page.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AddForumComponent } from './features/forums/component/add-forum/add-forum.component';
import { ForumsListComponent } from './features/forums/component/list-forum/list-forum.component';
import { EditForumComponent } from './features/forums/component/edit-forum/edit-forum.component';
import { ForumService } from './features/forums/service/forum.service';
import { CommonModule } from '@angular/common';
import { ForumDetailsComponent } from './features/forums/component/forum-details/forum-details.component';

// Import the Events module
import { EventsModule } from './features/events/events.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    DashboardPageComponent,
    NavbarComponent,
    SidebarComponent,
    LandingPageComponent,
    EditForumComponent,
    AddForumComponent,
    ForumsListComponent,
    ForumDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,              // 👈 Obligatoire pour [(ngModel)]
    ReactiveFormsModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    WalletsModule,
    CommonModule,
    EventsModule,             // 👈 Module des événements
    SharedModule              // 👈 Module partagé avec les directives
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ],

  bootstrap: [AppComponent]
})
export class AppModule {}
