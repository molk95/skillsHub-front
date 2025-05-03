import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/app.state';
import { IWallet } from '../../models/wallets.model';
import { WalletsService } from '../../services/wallets.service';
import * as WalletActions from '../../store/wallets.actions';

@Component({
  selector: 'app-wallet-status',
  templateUrl: './wallet-status.component.html',
  styleUrls: ['./wallet-status.component.css']
})
export class WalletStatusComponent implements OnInit {
  @Input() wallet: IWallet | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private walletsService: WalletsService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {}

  // toggleWalletStatus(): void {
  //   if (!this.wallet) return;
    
  //   this.isLoading = true;
  //   this.errorMessage = null;
  //   this.successMessage = null;
    
  //   const walletId = this.wallet._id as string;
    
  //   if (this.wallet.isActive) {
  //     this.deactivateWallet(walletId);
  //   } else {
  //     this.activateWallet(walletId);
  //   }
  // }

  private deactivateWallet(walletId: string): void {
    this.walletsService.deactivateWallet(walletId).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Wallet deactivated successfully';
        // Refresh wallet data
        this.store.dispatch(WalletActions.fetchWalletById({ id: walletId }));
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error || 'Failed to deactivate wallet';
      }
    });
  }

  private activateWallet(walletId: string): void {
    this.walletsService.activateWallet(walletId).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Wallet activated successfully';
        // Refresh wallet data
        this.store.dispatch(WalletActions.fetchWalletById({ id: walletId }));
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error || 'Failed to activate wallet';
      }
    });
  }
}


