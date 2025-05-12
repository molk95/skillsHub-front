import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPageComponent } from './features/dashboard/dashboard-page/dashboard-page.component';
import { LandingPageComponent } from './features/landing-page/landing-page.component';
import { ForumsListComponent } from './features/forums/component/list-forum/list-forum.component';
import { AddSalonsComponent } from './features/salons/components/add-salons/add-salons.component';
import { ListSalonsComponent } from './features/salons/components/list-salons/list-salons.component';
import { UpdateSalonsComponent } from './features/salons/components/update-salons/update-salons.component';
import { DeleteSalonsComponent } from './features/salons/components/delete-salons/delete-salons.component';
import { AddSessionsComponent } from './features/sessions/components/add-sessions/add-sessions.component';
import { SessionListComponent } from './features/sessions/components/list-sessions/list-sessions.component';
import { UpdateSessionComponent } from './features/sessions/components/update-sessions/update-sessions.component';
import { DeleteSessionsComponent } from './features/sessions/components/delete-sessions/delete-sessions.component';
import { SalonsSessionsComponent } from './features/salons/components/salons-sessions/salons-sessions.component';
import { AddWalletComponent } from './features/wallets/components/add-wallet/add-wallet.component';
import { WalletDetailsComponent } from './features/wallets/components/wallet-details/wallet-details.component';
import { LandingPageComponent } from './features/landing-page/landing-page.component';
import { AddSalonsComponent } from './features/salons/components/add-salons/add-salons.component';
import { ListSalonsComponent } from './features/salons/components/list-salons/list-salons.component';
import { UpdateSalonsComponent } from './features/salons/components/update-salons/update-salons.component';
import { DeleteSalonsComponent } from './features/salons/components/delete-salons/delete-salons.component';
import { AddSessionsComponent } from './features/sessions/components/add-sessions/add-sessions.component';
import { SessionListComponent } from './features/sessions/components/list-sessions/list-sessions.component';
import { UpdateSessionComponent } from './features/sessions/components/update-sessions/update-sessions.component';
import { DeleteSessionsComponent } from './features/sessions/components/delete-sessions/delete-sessions.component';
import { SalonsSessionsComponent } from './features/salons/components/salons-sessions/salons-sessions.component';

import { ForumsListComponent } from './features/forums/component/list-forum/list-forum.component';

const routes: Routes = [
  // Route par défaut vers la page d'accueil
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  // Page d'accueil
  {
    path: 'landing',
    component: LandingPageComponent
  },
  // Tableau de bord
  {
    path: 'ForumsListComponent',
   component: ForumsListComponent
  },
  {
    path: 'dashboard',
    component: DashboardPageComponent
  },
  // Gestion des wallets
  {
    path: 'wallets',
    loadChildren: () => import('./features/wallets/wallets.module').then(m => m.WalletsModule)
  },
  // Add a redirect for the singular "wallet" path
  {
    path: 'wallet',
    redirectTo: 'wallets',
    pathMatch: 'prefix'
  },
  // Catch-all route for the success and cancel pages
  {
    path: 'wallet/top-up/success',
    redirectTo: 'wallets/top-up/success',
    pathMatch: 'full'
  },
  {
    path: 'wallet/top-up/cancel',
    redirectTo: 'wallets/top-up/cancel',
    pathMatch: 'full'},
    {
    path: 'wallets/add',
    component: AddWalletComponent
  },
  {
    path: 'wallets/:id',
    component: WalletDetailsComponent
  },
  // Gestion des salons
  {
    path: 'salons/add',
    component: AddSalonsComponent
  },
  {
    path: 'salons/list',
    component: ListSalonsComponent
  },
  { path: 'salons/update/:nom', component: UpdateSalonsComponent },
  {
    path: 'salons/delete',
    component: DeleteSalonsComponent
  },
  // Gestion des sessions
  {
    path: 'sessions/add/:salonNom',
    component: AddSessionsComponent
  },
  { path: 'sessions/list', component: SessionListComponent }, // Route pour afficher les sessions
  { path: 'sessions/update/:id', component: UpdateSessionComponent}, // Route pour afficher les sessions
  { path: 'sessions/delete/:id', component: DeleteSessionsComponent },
    // Nouvelle route pour afficher les salons avec leurs sessions associées
  {
    path: 'salons-sessions',
    component: SalonsSessionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
