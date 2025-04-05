import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { DashboardPageComponent } from './features/dashboard/dashboard-page/dashboard-page.component';
import { NavbarComponent } from './features/layout/navbar/navbar.component';
import { SidebarComponent } from './features/layout/sidebar/sidebar.component';
import { LandingPageComponent } from './features/landing-page/landing-page.component';
import { WalletsListComponent } from './features/wallets/components/wallets-list/wallets-list.component';
import { WalletDetailsComponent } from './features/wallets/components/wallet-details/wallet-details.component';
import { WalletsEffects } from './features/wallets/store/wallets.effects';
import { reducers } from './core/app.state';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    DashboardPageComponent,
    NavbarComponent,
    SidebarComponent,
    LandingPageComponent,
    WalletsListComponent,
    WalletDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([WalletsEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
