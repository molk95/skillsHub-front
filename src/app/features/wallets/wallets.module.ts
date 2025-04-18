import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletsListComponent } from './components/wallets-list/wallets-list.component';
import { AddWalletComponent } from './components/add-wallet/add-wallet.component';
import { WalletDetailsComponent } from './components/wallet-details/wallet-details.component';
import { EditWalletComponent } from './components/edit-wallet/edit-wallet.component';
import { TopUpComponent } from './components/top-up/top-up.component';
import { CancelComponent } from './components/cancel/cancel.component';
import { SuccessComponent } from './components/success/success.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    WalletsListComponent,
    AddWalletComponent,
    WalletDetailsComponent,
    EditWalletComponent,
    TopUpComponent,
    CancelComponent,
    SuccessComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class WalletsModule { }
