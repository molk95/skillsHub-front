import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPageComponent } from './features/dashboard/dashboard-page/dashboard-page.component';
import { WalletsListComponent } from './features/wallets/components/wallets-list/wallets-list.component';
import { AddWalletComponent } from './features/wallets/components/add-wallet/add-wallet.component';
import { WalletDetailsComponent } from './features/wallets/components/wallet-details/wallet-details.component';
import { LandingPageComponent } from './features/landing-page/landing-page.component';
import { TopUpComponent } from './features/wallets/components/top-up/top-up.component';
import { SuccessComponent } from './features/wallets/components/success/success.component';
import { CancelComponent } from './features/wallets/components/cancel/cancel.component';

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
  { path: 'wallet/top-up', component: TopUpComponent },
  { path: 'wallet/top-up/success', component: SuccessComponent },
  { path: 'wallet/top-up/cancel', component: CancelComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  
}
