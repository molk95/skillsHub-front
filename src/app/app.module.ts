import { isDevMode, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { HttpErrorInterceptor } from './core/interceptors/http-error.interceptor';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers } from './core/app.state';
import { WalletsEffects } from './features/wallets/store/wallets.effects';

import { DashboardPageComponent } from './features/dashboard/dashboard-page/dashboard-page.component';
import { NavbarComponent } from './features/layout/navbar/navbar.component';
import { SidebarComponent } from './features/layout/sidebar/sidebar.component';
import { LandingPageComponent } from './features/landing-page/landing-page.component';


import { AuthModule } from './features/auth/auth.module';
import { MarketplaceModule } from './features/marketplace/marketplace.module';
import { CategoryModule } from './features/marketplace/Category/category.module';
import { FeedbackModule } from './features/feedback/feedback.module';
import { EventsModule } from './features/events/events.module';
import { SharedModule } from './shared/shared.module';
// IMPORTE tes modules salons, sessions, forums ici :
import { SalonsModule } from './features/salons/salons.module';
import { SessionsModule } from './features/sessions/sessions.module';
import { ForumsModule } from './features/forums/forums.module';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HomeComponent } from './features/home/home.component';
import { AboutComponent } from './features/about/about.component';
import { ContactComponent } from './features/contact/contact.component';
import { MarketplaceClientComponent } from './features/marketplace-client/marketplace-client.component';
import { ReactiveFormsModule } from '@angular/forms';
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
import { EditForumComponent } from './features/forums/component/edit-forum/edit-forum.component';
import { AddForumComponent } from './features/forums/component/add-forum/add-forum.component';
import { ForumsListComponent } from './features/forums/component/list-forum/list-forum.component';
import { ForumDetailsComponent } from './features/forums/component/forum-details/forum-details.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardPageComponent,
    NavbarComponent,
    SidebarComponent,
    LandingPageComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    AddSalonsComponent,
    ListSalonsComponent,
    UpdateSalonsComponent,
    DeleteSalonsComponent,
    SalonsComponent,
    SessionsComponent,
    AddSessionsComponent,
    SessionListComponent,
    UpdateSessionComponent,
    DeleteSessionsComponent,
    SalonsSessionsComponent,
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
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([WalletsEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    AuthModule,
    MarketplaceModule,
    CategoryModule,
    FeedbackModule,
    EventsModule,
    SharedModule,
    SalonsModule,
    SessionsModule,
    ForumsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
