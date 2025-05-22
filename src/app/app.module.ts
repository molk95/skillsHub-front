import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WalletsModule } from './features/wallets/wallets.module';
import {  CreateFeedbackComponent } from './features/feedback/components/create/create.component';
import {  ListFeedbackComponent } from './features/feedback/components/list/list.component';
import { UpdateFeedbackComponent } from './features/feedback/components/update/update.component';
import { DetailsFeedbackComponent } from './features/feedback/components/details/details.component';
import { DeleteFeedbackComponent } from './features/feedback/components/delete/delete.component';
import { FeedbackModule } from './features/feedback/feedback.module';

@NgModule({
  declarations: [
    AppComponent,
    CreateFeedbackComponent,
    ListFeedbackComponent,
    UpdateFeedbackComponent,
    DetailsFeedbackComponent,
    DeleteFeedbackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    WalletsModule,
    FeedbackModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
