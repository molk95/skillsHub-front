import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserWalletComponent } from './components/user-wallet/user-wallet.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';

const routes: Routes = [
  { path: '', component: UserWalletComponent },
  { path: 'transactions', component: TransactionHistoryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserWalletRoutingModule { }

