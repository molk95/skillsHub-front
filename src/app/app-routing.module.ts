import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { MarketplaceListComponent } from './features/marketplace/Skills/component/marketplace-list/marketplace-list.component';
import { MarketplaceDetailComponent } from './features/marketplace/Skills/component/marketplace-detail/marketplace-detail.component';
import { AddSkillComponent } from './features/marketplace/Skills/component/add-skill/add-skill.component';
import { UpdSkilComponent } from './features/marketplace/Skills/component/upd-skil/upd-skil.component';
import { SkillsMatchingComponent } from './features/marketplace/Skills/component/skills-matching/skills-matching.component';
import { UpdCatComponent } from './features/marketplace/Category/component/upd-cat/upd-cat.component';
import { AddCategoryComponent } from './features/marketplace/Category/component/add-category/add-category.component';
import { CategoryListComponent } from './features/marketplace/Category/component/category-list/category-list.component';
import { DashboardPageComponent } from './features/dashboard/dashboard-page/dashboard-page.component';
import { SignUpComponent } from './features/auth/components/sign-up/sign-up.component';
import { SalonDocumentsComponent } from './features/salons/components/salon-documents/salon-documents.component';
import { DetailSalonListComponent } from './features/salons/components/detail-salon-list/detail-salon-list.component';
const routes: Routes = [
  // Route par défaut vers la page d'accueil
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
  // Page d'accueil
  {
    path: 'landing',
    component: LandingPageComponent,
  },
  {
    path: 'signUp',
    component: SignUpComponent,
  },
  // Tableau de bord
  {
    path: 'ForumsListComponent',
    component: ForumsListComponent,
  },

  {
    path: 'UpdateCategory/:id',
    component: UpdCatComponent,
  },
  {
    path: 'AddCategory',
    component: AddCategoryComponent,
  },
  {
    path: 'CategoryList',
    component: CategoryListComponent,
  },
  {
    path: 'MarketplaceList',
    component: MarketplaceListComponent,
  },

  { path: 'upd-skil/:id', component: UpdSkilComponent },
  {
    path: 'MarketplaceDetail/:id',
    component: MarketplaceDetailComponent,
  },
  {
    path: 'skill/add',
    component: AddSkillComponent,
  },
  {
    path: 'dashboard',
    component: DashboardPageComponent,
  },
  // Gestion des wallets
  {
    path: 'wallets',
    loadChildren: () =>
      import('./features/wallets/wallets.module').then((m) => m.WalletsModule),
  },
  // Gestion des salons
  {
    path: 'salons/add',
    component: AddSalonsComponent,
  },
  {
    path: 'wallet/top-up/cancel',
    redirectTo: 'wallets/top-up/cancel',
    pathMatch: 'full'
  },
    {
    path: 'documents',
    component: DetailSalonListComponent
  },
  {
  path: 'salon/:id/documents',
  component: SalonDocumentsComponent
},

  {
    path: 'challenges',
    loadChildren: () => import('./features/challenges/challenges.module').then(m => m.ChallengesModule)
  },
  {
    path: 'badges',
    loadChildren: () => import('./features/badges/badges.module').then(m => m.BadgesModule),
  },
  {
    path: 'feedbacks',
    loadChildren: () => import('./features/feedback/feedback.module').then(m => m.FeedbackModule),
  },{
    path: 'salons/list',
    component: ListSalonsComponent,
  },
  { path: 'salons/update/:nom', component: UpdateSalonsComponent },
  {
    path: 'salons/delete',
    component: DeleteSalonsComponent,
  },

  // Gestion des sessions
  {
    path: 'sessions/add/:salonNom',
    component: AddSessionsComponent,
  },
    { path: 'sessions/list', component: SessionListComponent },
  { path: 'sessions/list/:salonName', component: SessionListComponent },
  { path: 'sessions/update/:id', component: UpdateSessionComponent }, // Route pour afficher les sessions
  { path: 'sessions/delete/:id', component: DeleteSessionsComponent },
  // Nouvelle route pour afficher les salons avec leurs sessions associées
  {
    path: 'salons-sessions',
    component: SalonsSessionsComponent,
  },
  {
    path: 'skills-matching',

    component: SkillsMatchingComponent,
  },
  //added by manel
  {
    path: '',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },


  {
    path: 'challenges',
    loadChildren: () => import('./features/challenges/challenges.module').then(m => m.ChallengesModule)
  },
  {
    path: 'badges',
    loadChildren: () => import('./features/badges/badges.module').then(m => m.BadgesModule),
  },
  {
    path: 'feedbacks',
    loadChildren: () => import('./features/feedback/feedback.module').then(m => m.FeedbackModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}