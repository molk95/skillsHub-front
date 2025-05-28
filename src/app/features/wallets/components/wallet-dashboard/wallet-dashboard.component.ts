import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/app.state';
import { IWallet } from '../../models/wallets.model';
import { IRewardsHistory, IRewardsWithConversion } from '../../models/rewards.model';
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

  // Rewards observables
  rewardsHistory$: Observable<IRewardsHistory[]>;
  rewardsLoading$: Observable<boolean>;
  userRewards$: Observable<IRewardsWithConversion | null>;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private walletService: WalletsService
  ) {
    this.wallet$ = this.store.select(state => state.wallets.selectedWallet);
    this.isLoading$ = this.store.select(state => state.wallets.isLoading);
    this.error$ = this.store.select(state => state.wallets.error);

    // Initialize rewards observables
    this.rewardsHistory$ = this.store.select(state => state.wallets.rewardsHistory);
    this.rewardsLoading$ = this.store.select(state => state.wallets.rewardsLoading);
    this.userRewards$ = this.store.select(state => state.wallets.userRewards);
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
        // Also load user rewards and history
        this.store.dispatch(WalletActions.fetchUserRewards({ userId }));
        this.store.dispatch(WalletActions.fetchRewardsHistory({ userId }));
      } else {
        // No wallet found — NOT an error
        this.store.dispatch(WalletActions.SetWalletLoader({ isLoading: false }));
        // Still try to load rewards even if no wallet
        this.store.dispatch(WalletActions.fetchUserRewards({ userId }));
        this.store.dispatch(WalletActions.fetchRewardsHistory({ userId }));
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
goBackToMyWallet(): void {
  this.router.navigate(['/wallets/wallet-dashboard']);
}

// Activity display methods
getActivityIcon(source: string): string {
  switch (source) {
    case 'wallet_topup':
      return '💰';
    case 'skill_purchase':
      return '🎯';
    case 'challenge_purchase':
      return '🏆';
    case 'points_to_imoney':
      return '🔄';
    default:
      return '⭐';
  }
}

getActivityLabel(source: string): string {
  switch (source) {
    case 'wallet_topup':
      return 'Wallet Top-up';
    case 'skill_purchase':
      return 'Skill Purchase';
    case 'challenge_purchase':
      return 'Challenge Purchase';
    case 'points_to_imoney':
      return 'Points Conversion';
    default:
      return 'Manual Points';
  }
}

formatActivityDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return 'Today';
  } else if (diffDays === 2) {
    return 'Yesterday';
  } else if (diffDays <= 7) {
    return `${diffDays - 1} days ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
}

// New methods for rewards preview
navigateToRewards(): void {
  this.router.navigate(['/wallets/rewards']);
}

quickConvertPoints(): void {
  // Navigate to rewards page with conversion focus
  this.router.navigate(['/wallets/rewards'], {
    queryParams: { action: 'convert' }
  });
}

}
