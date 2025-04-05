import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPageComponent } from './features/dashboard/dashboard-page/dashboard-page.component';
import { WalletsListComponent } from './features/wallets/components/wallets-list/wallets-list.component';
import { AddWalletComponent } from './features/wallets/components/add-wallet/add-wallet.component';
import { WalletDetailsComponent } from './features/wallets/components/wallet-details/wallet-details.component';
import { LandingPageComponent } from './features/landing-page/landing-page.component';

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
    path: 'dashboard',
    component: DashboardPageComponent
  },
  {
    path: 'wallets',
    component: WalletsListComponent
  },
  {
    path: 'wallets/add',
    component: AddWalletComponent
  },
  {
    path: 'wallets/:id',
    component: WalletDetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  
}
