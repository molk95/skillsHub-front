import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPageComponent } from './features/dashboard/dashboard-page/dashboard-page.component';
import { LandingPageComponent } from './features/landing-page/landing-page.component';
import { ForumsListComponent } from './features/forums/component/list-forum/list-forum.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  {
    path: 'landing',
    component: LandingPageComponent
  },
  {
    path: 'ForumsListComponent',
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
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
