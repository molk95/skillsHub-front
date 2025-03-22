import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletsListComponent } from './components/wallets-list/wallets-list.component';
import { WalletsDetailsComponent } from './components/wallets-details/wallets-details.component';
import { AddWalletComponent } from './components/add-wallet/add-wallet.component';
import { WalletDetailsComponent } from './components/wallet-details/wallet-details.component';
import { EditWalletComponent } from './components/edit-wallet/edit-wallet.component';



@NgModule({
  declarations: [
    WalletsListComponent,
    WalletsDetailsComponent,
    AddWalletComponent,
    WalletDetailsComponent,
    EditWalletComponent
  ],
  imports: [
    CommonModule
  ]
})
export class WalletsModule { }
