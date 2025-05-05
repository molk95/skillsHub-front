import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WalletsModule } from './features/wallets/wallets.module';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { DashboardPageComponent } from './features/dashboard/dashboard-page/dashboard-page.component';
import { NavbarComponent } from './features/layout/navbar/navbar.component';
import { SidebarComponent } from './features/layout/sidebar/sidebar.component';
import { LandingPageComponent } from './features/landing-page/landing-page.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AddForumComponent } from './features/forums/component/add-forum/add-forum.component';
import { ForumsListComponent } from './features/forums/component/list-forum/list-forum.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardPageComponent,
    NavbarComponent,
    SidebarComponent,
    LandingPageComponent,
    AddForumComponent,
    ForumsListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    WalletsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
