import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPageComponent } from './features/dashboard/dashboard-page/dashboard-page.component';
import { LandingPageComponent } from './features/landing-page/landing-page.component';
import { ForumsListComponent } from './features/forums/component/list-forum/list-forum.component';
import { AddForumComponent } from './features/forums/component/add-forum/add-forum.component';
import { EditForumComponent } from './features/forums/component/edit-forum/edit-forum.component';
import { ForumDetailsComponent } from './features/forums/component/forum-details/forum-details.component';
import { CommunitiesModule } from './features/communities/communities.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  {
    path: 'forums/edit/:id',
    component: EditForumComponent
  },
  {
    path: 'forums/add',
    component: AddForumComponent
  },
  {
    path: 'landing',
    component: LandingPageComponent
  },
  {
    path: 'forums/details/:id',
    component: ForumDetailsComponent
  },
  {
    path: 'forums',
    component: ForumsListComponent
  },
  {
    path: 'dashboard',
    component: DashboardPageComponent
  },
  {
    path: 'wallets',
    loadChildren: () => import('./features/wallets/wallets.module').then(m => m.WalletsModule)
  },
  // Redirection pour le chemin wallet
  {
    path: 'wallet',
    redirectTo: 'wallets',
    pathMatch: 'prefix'
  },
  // Catch-all route pour les pages success et cancel
  {
    path: 'wallet/top-up/success',
    redirectTo: 'wallets/top-up/success',
    pathMatch: 'full'
  },
  {
    path: 'wallet/top-up/cancel',
    redirectTo: 'wallets/top-up/cancel',
    pathMatch: 'full'
  },
  // Redirection pour gérer la casse
  {
    path: 'Forums',
    redirectTo: 'forums',
    pathMatch: 'full'
  },
  {
    path: 'Forums/edit/:id',
    redirectTo: 'forums/edit/:id',
    pathMatch: 'full'
  },
  {
    path: 'Forums/add',
    redirectTo: 'forums/add',
    pathMatch: 'full'
  },
  {
    path: 'communities',
    loadChildren: () => import('./features/communities/communities.module').then(m => m.CommunitiesModule)
  },
  {
    path: 'test-permissions',
    loadChildren: () => import('./test-permissions.module').then(m => m.TestPermissionsModule)
  },
  // Redirection pour gérer la casse pour communities
  {
    path: 'Communities',
    redirectTo: 'communities',
    pathMatch: 'full'
  },
  {
    path: 'Communities/create',
    redirectTo: 'communities/create',
    pathMatch: 'full'
  },
  {
    path: 'Communities/edit/:id',
    redirectTo: 'communities/edit/:id',
    pathMatch: 'full'
  },
  {
    path: 'Communities/my-communities',
    redirectTo: 'communities/my-communities',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
