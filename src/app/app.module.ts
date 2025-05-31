import { isDevMode, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { HttpErrorInterceptor } from './core/interceptors/http-error.interceptor';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { WalletsModule } from './features/wallets/wallets.module';
import { NavbarComponent } from './features/layout/navbar/navbar.component';
import { SidebarComponent } from './features/layout/sidebar/sidebar.component';
import { LandingPageComponent } from './features/landing-page/landing-page.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddForumComponent } from './features/forums/component/add-forum/add-forum.component';
import { ForumsListComponent } from './features/forums/component/list-forum/list-forum.component';
import { WalletsEffects } from './features/wallets/store/wallets.effects';
import { reducers } from './core/app.state';
import { AddSalonsComponent } from './features/salons/components/add-salons/add-salons.component';
import { ListSalonsComponent } from './features/salons/components/list-salons/list-salons.component';
import { UpdateSalonsComponent } from './features/salons/components/update-salons/update-salons.component';
import { DeleteSalonsComponent } from './features/salons/components/delete-salons/delete-salons.component';
import { SalonsComponent } from './features/salons/components/salons/salons.component';
import { SessionsComponent } from './features/sessions/components/sessions/sessions.component';
import { AddSessionsComponent } from './features/sessions/components/add-sessions/add-sessions.component';
import { SessionListComponent } from './features/sessions/components/list-sessions/list-sessions.component';
import { UpdateSessionComponent } from './features/sessions/components/update-sessions/update-sessions.component';
import { DeleteSessionsComponent } from './features/sessions/components/delete-sessions/delete-sessions.component';
import { SalonsSessionsComponent } from './features/salons/components/salons-sessions/salons-sessions.component';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { SignInComponent } from './features/auth/components/sign-in/sign-in.component';
import { AuthModule } from './features/auth/auth.module';
import { MarketplaceModule } from './features/marketplace/marketplace.module';
import { CategoryModule } from './features/marketplace/Category/category.module';
import { CreateFeedbackComponent } from './features/feedback/components/create/create.component';
import { ListFeedbackComponent } from './features/feedback/components/list/list.component';
import { UpdateFeedbackComponent } from './features/feedback/components/update/update.component';
import { DetailsFeedbackComponent } from './features/feedback/components/details/details.component';
import { DeleteFeedbackComponent } from './features/feedback/components/delete/delete.component';
import { FeedbackModule } from './features/feedback/feedback.module';

import { EditForumComponent } from './features/forums/component/edit-forum/edit-forum.component';
import { ForumService } from './features/forums/service/forum.service';
import { ForumDetailsComponent } from './features/forums/component/forum-details/forum-details.component';

// Import the Events module
import { EventsModule } from './features/events/events.module';
import { SharedModule } from './shared/shared.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HomeComponent } from './features/home/home.component';
import { AboutComponent } from './features/about/about.component';
import { ContactComponent } from './features/contact/contact.component';
import { MarketplaceClientComponent } from './features/marketplace-client/marketplace-client.component';
import { SalonsModule } from './features/salons/salons.module';
import { SessionsModule } from './features/sessions/sessions.module';

@NgModule({
  declarations: [
    AppComponent,
    CreateFeedbackComponent,
    ListFeedbackComponent,
    UpdateFeedbackComponent,
    DetailsFeedbackComponent,
    DeleteFeedbackComponent,
    NavbarComponent,
    SidebarComponent,
    LandingPageComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    EditForumComponent,
    AddForumComponent,
    ForumsListComponent,
    ForumDetailsComponent,
    MarketplaceClientComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule, // 👈 Obligatoire pour [(ngModel)]
    ReactiveFormsModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    FeedbackModule,
    ReactiveFormsModule,
    FormsModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([WalletsEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    FormsModule,
    CommonModule, // Ajoute ceci ici aussi
    AuthModule,
    MarketplaceModule,
    EventsModule, // 👈 Module des événements
    SharedModule,
    SalonsModule,
    SessionsModule,
    CategoryModule,
    MarketplaceModule,

    FeedbackModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
