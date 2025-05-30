import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WalletsListComponent } from './components/wallets-list/wallets-list.component';
import { WalletDetailsComponent } from './components/wallet-details/wallet-details.component';
import { PackageSelectionComponent } from './components/package-selection/package-selection.component';
import { TopUpComponent } from './components/top-up/top-up.component';
import { SuccessComponent } from './components/success/success.component';
import { CancelComponent } from './components/cancel/cancel.component';
import { WalletDashboardComponent } from './components/wallet-dashboard/wallet-dashboard.component';
import { RewardsComponent } from './components/rewards/rewards.component';
import { AdminWalletDetailsComponent } from './components/admin-wallet-details/admin-wallet-details.component';
import { AdminRewardsManagementComponent } from './components/admin-rewards-management/admin-rewards-management.component';
import { SendGiftComponent } from './components/send-gift/send-gift.component';
import { GiftSuccessComponent } from './components/gift-success/gift-success.component';
import { GiftHistoryComponent } from './components/gift-history/gift-history.component';

const routes: Routes = [
  { path: '', component: WalletsListComponent },
  { path: 'wallet-dashboard', component: WalletDashboardComponent },
  { path: 'rewards', component: RewardsComponent },
  { path: 'admin-rewards', component: AdminRewardsManagementComponent },
  { path: 'send-gift', component: SendGiftComponent },
  { path: 'gift-success', component: GiftSuccessComponent },
  { path: 'gift-history', component: GiftHistoryComponent },
  { path: 'packages', component: PackageSelectionComponent },
  { path: 'top-up', component: TopUpComponent },
  { path: 'top-up/success', component: SuccessComponent },
  { path: 'top-up/cancel', component: CancelComponent },
  { path: 'admin-details/:id', component: AdminWalletDetailsComponent },
  { path: ':id', component: WalletDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WalletsRoutingModule { }

