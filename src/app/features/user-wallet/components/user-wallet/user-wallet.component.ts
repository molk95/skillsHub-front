import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/core/app.state';
import { IWallet } from '../../../wallets/models/wallets.model';
import * as WalletsActions from '../../../wallets/store/wallets.actions';
import * as UserWalletActions from '../../store/user-wallet.actions';
import { UserWalletService } from '../../services/user-wallet.service';

@Component({
  selector: 'app-user-wallet',
  templateUrl: './user-wallet.component.html',
  styleUrls: ['./user-wallet.component.css']
})
export class UserWalletComponent implements OnInit {
  wallet$: Observable<IWallet | null>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  userId: string | null = null;
  statusMessage: string | null = null;
  statusError: string | null = null;
  
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private userWalletService: UserWalletService
  ) {
    this.wallet$ = this.store.select(state => state.wallets.selectedWallet);
    this.isLoading$ = this.store.select(state => state.wallets.isLoading);
    this.error$ = this.store.select(state => state.wallets.error);
  }

  ngOnInit(): void {
    // Get user ID from localStorage
    this.userId = localStorage.getItem('userId');
    
    if (this.userId) {
      // Fetch user's wallet
      this.store.dispatch(WalletsActions.fetchWalletById({ id: this.userId }));
    }
  }

  createWallet(): void {
    if (!this.userId) {
      this.statusError = 'User ID not found. Please log in again.';
      return;
    }
    
    const walletData = {
      user: this.userId,
      imoney: {
        value: 0,
        currencyType: 'iMoney'
      }
    };
    
    this.store.dispatch(UserWalletActions.createWallet({ walletData }));
    
    // Subscribe to the result to update the UI
    this.store.select(state => state.userWallet.wallet).subscribe(wallet => {
      if (wallet) {
        // Refresh wallet data in the wallets store
        this.store.dispatch(WalletsActions.fetchWalletById({ id: this.userId! }));
      }
    });
  }

  topUpWallet(): void {
    this.router.navigate(['/wallets/packages']);
  }

  toggleWalletStatus(wallet: IWallet): void {
    if (!wallet || !wallet._id) return;
    
    if (wallet.isActive) {
      this.userWalletService.deactivateWallet(wallet._id).subscribe({
        next: () => {
          this.statusMessage = 'Wallet deactivated successfully';
          this.statusError = null;
          // Refresh wallet data
          if (this.userId) {
            this.store.dispatch(WalletsActions.fetchWalletById({ id: this.userId }));
          }
        },
        error: (error) => {
          this.statusError = error.error?.error || 'Failed to deactivate wallet';
          this.statusMessage = null;
          console.error('Failed to deactivate wallet:', error);
        }
      });
    } else {
      this.userWalletService.activateWallet(wallet._id).subscribe({
        next: () => {
          this.statusMessage = 'Wallet activated successfully';
          this.statusError = null;
          // Refresh wallet data
          if (this.userId) {
            this.store.dispatch(WalletsActions.fetchWalletById({ id: this.userId }));
          }
        },
        error: (error) => {
          this.statusError = error.error?.error || 'Failed to activate wallet';
          this.statusMessage = null;
          console.error('Failed to activate wallet:', error);
        }
      });
    }
  }

  viewTransactionHistory(): void {
    this.router.navigate(['/user-wallet/transactions']);
  }

  goToMarketplace(): void {
    this.router.navigate(['/user-wallet/marketplace']);
  }
}



