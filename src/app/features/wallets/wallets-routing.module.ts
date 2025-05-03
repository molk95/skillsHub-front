import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WalletsListComponent } from './components/wallets-list/wallets-list.component';
import { WalletDetailsComponent } from './components/wallet-details/wallet-details.component';
import { PackageSelectionComponent } from './components/package-selection/package-selection.component';
import { TopUpComponent } from './components/top-up/top-up.component';
import { SuccessComponent } from './components/success/success.component';
import { CancelComponent } from './components/cancel/cancel.component';

const routes: Routes = [
  { path: '', component: WalletsListComponent },
  { path: 'packages', component: PackageSelectionComponent },
  { path: 'top-up', component: TopUpComponent },
  { path: 'top-up/success', component: SuccessComponent },
  { path: 'top-up/cancel', component: CancelComponent },
  { path: ':id', component: WalletDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WalletsRoutingModule { }

