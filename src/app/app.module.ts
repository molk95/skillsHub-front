import { isDevMode, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { WalletsModule } from './features/wallets/wallets.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { DashboardPageComponent } from './features/dashboard/dashboard-page/dashboard-page.component';
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
import { HttpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { SalonsSessionsComponent } from './features/salons/components/salons-sessions/salons-sessions.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthModule } from './features/auth/auth.module';
import { MarketplaceModule } from './features/marketplace/marketplace.module';
import { CategoryModule } from './features/marketplace/Category/category.module';
import { CreateFeedbackComponent } from './features/feedback/components/create/create.component';
import { ListFeedbackComponent } from './features/feedback/components/list/list.component';
import { UpdateFeedbackComponent } from './features/feedback/components/update/update.component';
import { DetailsFeedbackComponent } from './features/feedback/components/details/details.component';
import { DeleteFeedbackComponent } from './features/feedback/components/delete/delete.component';
import { FeedbackModule } from './features/feedback/feedback.module';

// AJOUTE ICI tes composants salon-documents :
import { SalonDocumentsComponent } from './features/salons/components/salon-documents/salon-documents.component';
import { DetailSalonListComponent } from './features/salons/components/detail-salon-list/detail-salon-list.component';
import { JoinSessionComponent } from './features/sessions/components/join-session/join-session.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateFeedbackComponent,
    ListFeedbackComponent,
    UpdateFeedbackComponent,
    DetailsFeedbackComponent,
    DeleteFeedbackComponent,
    DashboardPageComponent,
    NavbarComponent,
    SidebarComponent,
    LandingPageComponent,
    AddForumComponent,
    ForumsListComponent,
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
    // Ajoute ceux-ci :
    SalonDocumentsComponent,
    DetailSalonListComponent,
    JoinSessionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([WalletsEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    WalletsModule,
    FeedbackModule,
    AuthModule,
    CategoryModule,
    MarketplaceModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}