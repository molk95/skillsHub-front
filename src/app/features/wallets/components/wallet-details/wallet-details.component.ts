import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppState } from 'src/app/core/app.state';
import { IWallet } from '../../models/wallets.model';
import { IRewardsHistory, IRewardsWithConversion } from '../../models/rewards.model';
import * as WalletActions from '../../store/wallets.actions';
import { WalletsService } from '../../services/wallets.service';

@Component({
  selector: 'app-wallet-details',
  templateUrl: './wallet-details.component.html',
  styleUrls: ['./wallet-details.component.css']
})
export class WalletDetailsComponent implements OnInit, OnDestroy {
  wallet$: Observable<IWallet | null>;
  isLoading$: Observable<boolean>;
  private routeSubscription: Subscription | null = null;
  userRole: string | null = null;

  // Rewards observables
  rewardsHistory$: Observable<IRewardsHistory[]>;
  rewardsLoading$: Observable<boolean>;
  userRewards$: Observable<IRewardsWithConversion | null>;


  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private walletsService: WalletsService
  ) {
    this.wallet$ = this.store.select(state => state.wallets.selectedWallet);
    this.isLoading$ = this.store.select(state => state.wallets.isLoading);

    // Initialize rewards observables
    this.rewardsHistory$ = this.store.select(state => state.wallets.rewardsHistory);
    this.rewardsLoading$ = this.store.select(state => state.wallets.rewardsLoading);
    this.userRewards$ = this.store.select(state => state.wallets.userRewards);
  }

  ngOnInit(): void {
    // Get user role
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    this.userRole = user?.role || null;

    // Initial load from route params
    this.loadWalletFromRouteParams();

    // Subscribe to route parameter changes to handle navigation between different wallet details
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const walletId = params.get('id');
      if (walletId) {
        this.fetchWalletData(walletId);
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private loadWalletFromRouteParams(): void {
    const walletId = this.route.snapshot.paramMap.get('id');
    if (walletId) {
      this.fetchWalletData(walletId);
    } else {
      console.error('No wallet ID found in route parameters');
    }
  }

  private fetchWalletData(walletId: string): void {
    console.log('Fetching wallet with ID:', walletId);
    this.store.dispatch(WalletActions.fetchWalletById({ id: walletId }));

    // Also load rewards data if we have a user ID
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?.id || user?._id || null;

    if (userId) {
      this.store.dispatch(WalletActions.fetchUserRewards({ userId }));
      this.store.dispatch(WalletActions.fetchRewardsHistory({ userId }));
    }
  }



  goBackToWallets(): void {
    this.router.navigate(['/wallets']);
  }
goBackToMyWallet(): void {
  this.router.navigate(['/wallets/wallet-dashboard']);
}

navigateToRewards(): void {
  this.router.navigate(['/wallets/rewards']);
}

  handleTopUpClick(wallet: IWallet): void {
    if (!wallet.isActive) {
      console.log('Wallet is inactive - please contact support');
      return;
    }

    this.router.navigate(['/wallets/packages']);
  }

  // Activity display methods (same as wallet dashboard)
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

  // Client-focused methods
  exportTransactions(): void {
    // TODO: Implement transaction export functionality for client
    console.log('Exporting my transaction history...');
    // This could generate a CSV or PDF of the user's own transaction history
  }
}
