import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPageComponent } from './features/dashboard/dashboard-page/dashboard-page.component';
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
  // Page d'accueil
import { MarketplaceListComponent } from './features/marketplace/component/marketplace-list/marketplace-list.component';
import { MarketplaceDetailComponent } from './features/marketplace/component/marketplace-detail/marketplace-detail.component';
import { AddSkillComponent } from './features/marketplace/component/add-skill/add-skill.component';
import { UpdSkilComponent } from './features/marketplace/component/upd-skil/upd-skil.component';
import { SkillsMatchingComponent } from './features/marketplace/component/skills-matching/skills-matching.component';

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
    path: 'MarketplaceList',
    component: MarketplaceListComponent
  },

  { path: 'upd-skil/:id', 
    component: UpdSkilComponent 
  },
  {
    path: 'MarketplaceDetail/:id',
    component: MarketplaceDetailComponent
  },
  {
    path: 'skill/add',
    component: AddSkillComponent
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
  },
  {
    path: 'skills-matching',
    component: SkillsMatchingComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
