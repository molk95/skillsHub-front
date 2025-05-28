import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { WalletsRoutingModule } from './wallets-routing.module';
import { WalletsListComponent } from './components/wallets-list/wallets-list.component';
import { AddWalletComponent } from './components/add-wallet/add-wallet.component';
import { WalletDetailsComponent } from './components/wallet-details/wallet-details.component';
import { EditWalletComponent } from './components/edit-wallet/edit-wallet.component';
import { PackageSelectionComponent } from './components/package-selection/package-selection.component';
import { TopUpComponent } from './components/top-up/top-up.component';
import { CancelComponent } from './components/cancel/cancel.component';
import { SuccessComponent } from './components/success/success.component';
import { WalletStatusComponent } from './components/wallet-status/wallet-status.component';

import { walletsReducer } from './store/wallets.reducers';
import { WalletsEffects } from './store/wallets.effects';
import { WalletDashboardComponent } from './components/wallet-dashboard/wallet-dashboard.component';
import { RewardsComponent } from './components/rewards/rewards.component';
import { AdminWalletDetailsComponent } from './components/admin-wallet-details/admin-wallet-details.component';

@NgModule({
  declarations: [
    WalletsListComponent,
    AddWalletComponent,
    WalletDetailsComponent,
    EditWalletComponent,
    PackageSelectionComponent,
    TopUpComponent,
    CancelComponent,
    SuccessComponent,
    WalletStatusComponent,
    WalletDashboardComponent,
    RewardsComponent,
    AdminWalletDetailsComponent
  ],
  imports: [
    CommonModule,
    WalletsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('wallets', walletsReducer),
    EffectsModule.forFeature([WalletsEffects])
  ],
  exports: [
    WalletDetailsComponent,
    TopUpComponent,
    WalletStatusComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WalletsModule { }
