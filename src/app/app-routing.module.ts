import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPageComponent } from './features/dashboard/dashboard-page/dashboard-page.component';
import { LandingPageComponent } from './features/landing-page/landing-page.component';
import { HomeComponent } from './features/home/home.component';
import { AboutComponent } from './features/about/about.component';
import { ContactComponent } from './features/contact/contact.component';
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
import { AddForumComponent } from './features/forums/component/add-forum/add-forum.component';
import { EditForumComponent } from './features/forums/component/edit-forum/edit-forum.component';
import { ForumDetailsComponent } from './features/forums/component/forum-details/forum-details.component';
import { CommunitiesModule } from './features/communities/communities.module';

// Page d'accueil
import { MarketplaceListComponent } from './features/marketplace/Skills/component/marketplace-list/marketplace-list.component';
import { MarketplaceDetailComponent } from './features/marketplace/Skills/component/marketplace-detail/marketplace-detail.component';
import { AddSkillComponent } from './features/marketplace/Skills/component/add-skill/add-skill.component';
import { UpdSkilComponent } from './features/marketplace/Skills/component/upd-skil/upd-skil.component';
import { SkillsMatchingComponent } from './features/marketplace/Skills/component/skills-matching/skills-matching.component';
import { UpdCatComponent } from './features/marketplace/Category/component/upd-cat/upd-cat.component';
import { AddCategoryComponent } from './features/marketplace/Category/component/add-category/add-category.component';
import { CategoryListComponent } from './features/marketplace/Category/component/category-list/category-list.component';
import { SignUpComponent } from './features/auth/components/sign-up/sign-up.component';
import { MarketplaceClientComponent } from '../app/features/marketplace-client/marketplace-client.component';
import { DetailSalonListComponent } from './features/salons/components/detail-salon-list/detail-salon-list.component';
import { SalonDocumentsComponent } from './features/salons/components/salon-documents/salon-documents.component';

import { NotFoundComponent } from './shared/components/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'contact',
    component: ContactComponent,
  },
  {
    path: 'forums/edit/:id',
    component: EditForumComponent,
  },
  {
    path: 'forums/add',
    component: AddForumComponent,
  },
  {
    path: 'landing',
    component: LandingPageComponent,
  },
  {
    path: 'signUp',
    component: SignUpComponent,
  },
  {
    path: 'forums/details/:id',
    component: ForumDetailsComponent,
  },
  {
    path: 'forums',
    component: ForumsListComponent,
  },
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
  {
    path: 'MarketplaceClient',
    component: MarketplaceClientComponent,
  },
  {
    path: 'upd-skil/:id',
    component: UpdSkilComponent,
  },
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
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: 'wallets',
    loadChildren: () =>
      import('./features/wallets/wallets.module').then((m) => m.WalletsModule),
  },
  // Redirection pour le chemin wallet
  {
    path: 'salons/add',
    component: AddSalonsComponent,
  },
  {
    path: 'documents',
    component: DetailSalonListComponent,
  },
  {
    path: 'salon/:id/documents',
    component: SalonDocumentsComponent,
  },
  // Catch-all route pour les pages success et cancel
  {
    path: 'wallet/top-up/cancel',
    redirectTo: 'wallets/top-up/cancel',
    pathMatch: 'full',
  },
  {
    path: 'challenges',

    loadChildren: () =>
      import('./features/challenges/challenges.module').then(
        (m) => m.ChallengesModule
      ),
  },
  {
    path: 'badges',

    loadChildren: () =>
      import('./features/badges/badges.module').then((m) => m.BadgesModule),
  },
  {
    path: 'feedbacks',

    loadChildren: () =>
      import('./features/feedback/feedback.module').then(
        (m) => m.FeedbackModule
      ),
  },
  {
    path: 'salons/list',

    component: ListSalonsComponent,
  },
  {
    path: 'salons/update/:nom',

    component: UpdateSalonsComponent,
  },
  {
    path: 'salons/delete',
    component: DeleteSalonsComponent,
  },
  {
    path: 'sessions/list/:salonName',

    component: SessionListComponent,
  },
  {
    path: 'sessions/add/:salonNom',

    component: AddSessionsComponent,
  },
  {
    path: 'sessions/list',

    component: SessionListComponent,
  },
  {
    path: 'sessions/update/:id',

    component: UpdateSessionComponent,
  },
  {
    path: 'sessions/delete/:id',
    component: DeleteSessionsComponent,
  },
  // Nouvelle route pour afficher les salons avec leurs sessions associées
  {
    path: 'salons-sessions',

    component: SalonsSessionsComponent,
  },
  {
    path: 'Forums',
    redirectTo: 'forums',
    pathMatch: 'full',
  },
  {
    path: 'Forums/edit/:id',
    redirectTo: 'forums/edit/:id',
    pathMatch: 'full',
  },
  {
    path: 'Forums/add',
    redirectTo: 'forums/add',
    pathMatch: 'full',
  },
  {
    path: 'communities',

    loadChildren: () =>
      import('./features/communities/communities.module').then(
        (m) => m.CommunitiesModule
      ),
  },
  {
    path: 'Communities',
    redirectTo: 'communities',
    pathMatch: 'full',
  },
  {
    path: 'Communities/create',
    redirectTo: 'communities/create',
    pathMatch: 'full',
  },
  {
    path: 'Communities/edit/:id',
    redirectTo: 'communities/edit/:id',
    pathMatch: 'full',
  },
  {
    path: 'Communities/my-communities',
    redirectTo: 'communities/my-communities',
    pathMatch: 'full',
  },
  // Redirection pour gérer la casse
  {
    path: 'Forums',
    redirectTo: 'forums',
    pathMatch: 'full',
  },
  {
    path: 'Forums/edit/:id',
    redirectTo: 'forums/edit/:id',
    pathMatch: 'full',
  },
  {
    path: 'Forums/add',
    redirectTo: 'forums/add',
    pathMatch: 'full',
  },
  {
    path: 'communities',

    loadChildren: () =>
      import('./features/communities/communities.module').then(
        (m) => m.CommunitiesModule
      ),
  },

  // Redirection pour gérer la casse pour communities
  {
    path: 'Communities',
    redirectTo: 'communities',
    pathMatch: 'full',
  },
  {
    path: 'Communities/create',
    redirectTo: 'communities/create',
    pathMatch: 'full',
  },
  {
    path: 'Communities/edit/:id',
    redirectTo: 'communities/edit/:id',
    pathMatch: 'full',
  },
  {
    path: 'Communities/my-communities',
    redirectTo: 'communities/my-communities',
    pathMatch: 'full',
  },
  {
    path: 'skills-matching',

    component: SkillsMatchingComponent,
  },
  // Auth routes
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  // Legacy auth route for compatibility
  {
    path: '',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'challenges',

    loadChildren: () =>
      import('./features/challenges/challenges.module').then(
        (m) => m.ChallengesModule
      ),
  },
  {
    path: 'badges',

    loadChildren: () =>
      import('./features/badges/badges.module').then((m) => m.BadgesModule),
  },
  {
    path: 'feedbacks',

    loadChildren: () =>
      import('./features/feedback/feedback.module').then(
        (m) => m.FeedbackModule
      ),
  },
  // Catch-all routes for undefined paths
  // These MUST be at the end of the routes array
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: '**', // Wildcard route - catches all undefined routes
    redirectTo: 'not-found',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
