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
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';

import { AuthModule } from './features/auth/auth.module';
import { MarketplaceModule } from './features/marketplace/marketplace.module';
import { CategoryModule } from './features/marketplace/Category/category.module';
import { FeedbackModule } from './features/feedback/feedback.module';
import { EventsModule } from './features/events/events.module';
import { SharedModule } from './shared/shared.module';
import { SalonsModule } from './features/salons/salons.module';
import { SessionsModule } from './features/sessions/sessions.module';
import { ForumsModule } from './features/forums/forums.module';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ReactiveFormsModule } from '@angular/forms';

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
    // ⚠️ NE PAS AJOUTER les composants feedback ici !
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
    FeedbackModule, // juste le module !
    EventsModule,
    SharedModule,
    SalonsModule,
    SessionsModule,
    ForumsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}