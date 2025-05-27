import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/app.state';
import { IWallet } from '../../models/wallets.model';
import * as WalletActions from '../../store/wallets.actions';
import { WalletsService } from '../../services/wallets.service';

@Component({
  selector: 'app-wallet-dashboard',
  templateUrl: './wallet-dashboard.component.html',
  styleUrls: ['./wallet-dashboard.component.css']
})
  export class WalletDashboardComponent implements OnInit {
  wallet$: Observable<IWallet | null>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  walletId: string | null = null;
  userRole: string | null = null;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private walletService: WalletsService
  ) {
    this.wallet$ = this.store.select(state => state.wallets.selectedWallet);
    this.isLoading$ = this.store.select(state => state.wallets.isLoading);
    this.error$ = this.store.select(state => state.wallets.error);
  }

ngOnInit(): void {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?.id || user?._id || null;

  // Get user role for role-based visibility
  this.userRole = user?.role || null;

  if (!userId) {
    this.store.dispatch(WalletActions.fetchWalletByIdFailure({
      error: 'User ID not found. Please log in again.'
    }));
    return;
  }

  this.store.dispatch(WalletActions.SetWalletLoader({ isLoading: true }));

  this.walletService.getWalletByUserId(userId).subscribe({
    next: (wallet) => {
      if (wallet && wallet._id) {
        this.walletId = wallet._id;
        this.store.dispatch(WalletActions.fetchWalletById({ id: wallet._id }));
      } else {
        // No wallet found — NOT an error
        this.store.dispatch(WalletActions.SetWalletLoader({ isLoading: false }));
        // Do not dispatch fetchWalletByIdFailure here
      }
    },
    error: (error) => {
      this.store.dispatch(WalletActions.SetWalletLoader({ isLoading: false }));
      this.store.dispatch(WalletActions.fetchWalletByIdFailure({
        error: error.message || 'Failed to fetch wallet information'
      }));
    }
  });
}



  topUpWallet(): void {
    if (this.walletId) {
      this.router.navigate(['/wallets/packages'], {
        queryParams: { walletId: this.walletId }
      });
    } else {
      this.store.dispatch(WalletActions.fetchWalletByIdFailure({
        error: 'Wallet ID not available for top-up'
      }));
    }
  }

  viewTransactions(): void {
    if (this.walletId) {
      this.router.navigate(['/wallets/transactions'], {
        queryParams: { walletId: this.walletId }
      });
    } else {
      this.store.dispatch(WalletActions.fetchWalletByIdFailure({
        error: 'Wallet ID not available to view transactions'
      }));
    }
  }

  createWalletIfNeeded(): void {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?.id || user?._id || null;

  if (!userId) {
    this.store.dispatch(WalletActions.fetchWalletByIdFailure({
      error: 'User ID not found. Please log in again.'
    }));
    return;
  }

  this.store.dispatch(WalletActions.SetWalletLoader({ isLoading: true }));

  const walletData = {
    user: userId,  // Changed from userId to user
    imoney: {
      value: 150,
      currencyType: 'iMoney'
    }
  };

  this.walletService.createWallet(walletData).subscribe({
    next: (newWallet) => {
      this.walletId = newWallet._id;
      this.store.dispatch(WalletActions.fetchWalletById({ id: newWallet._id }));
    },
    error: (error) => {
      this.store.dispatch(WalletActions.SetWalletLoader({ isLoading: false }));
      this.store.dispatch(WalletActions.fetchWalletByIdFailure({
        error: error.message || 'Failed to create wallet'
      }));
    }
  });
}

goBackToWallets(): void {
  this.router.navigate(['/wallets']);
}

}
