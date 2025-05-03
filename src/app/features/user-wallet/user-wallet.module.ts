import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { UserWalletRoutingModule } from './user-wallet-routing.module';
import { UserWalletComponent } from './components/user-wallet/user-wallet.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';
import { userWalletReducer } from './store/user-wallet.reducers';
import { UserWalletEffects } from './store/user-wallet.effects';

@NgModule({
  declarations: [
    UserWalletComponent,
    TransactionHistoryComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserWalletRoutingModule,
    RouterModule,
    StoreModule.forFeature('userWallet', userWalletReducer),
    EffectsModule.forFeature([UserWalletEffects])
  ],
  exports: [
    UserWalletComponent
  ]
})
export class UserWalletModule { }
