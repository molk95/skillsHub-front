import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppState } from 'src/app/core/app.state';
import { IWallet } from '../../models/wallets.model';
import { IRewardsHistory } from '../../models/rewards.model';
import * as WalletsActions from '../../store/wallets.actions';
import { WalletsService } from '../../services/wallets.service';

@Component({
  selector: 'app-admin-wallet-details',
  templateUrl: './admin-wallet-details.component.html',
  styleUrls: ['./admin-wallet-details.component.css']
})
export class AdminWalletDetailsComponent implements OnInit, OnDestroy {
  wallet$: Observable<IWallet | null>;
  isLoading$: Observable<boolean>;
  isToggling = false;
  statusError: string | null = null;
  statusSuccess: string | null = null;
  canActivate = false;
  timeUntilActivation: string | null = null;
  private routeSubscription: Subscription | null = null;
  private walletSubscription: Subscription | null = null;
  userRole: string | null = null;
  isAuthorized = false;

  // Rewards data
  userRewards: {
    points: number;
    totalEarned: number;
    totalConverted: number;
  } | null = null;
  isLoadingRewards = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private walletsService: WalletsService
  ) {
    this.wallet$ = this.store.select((state) => state.wallets.selectedWallet);
    this.isLoading$ = this.store.select((state) => state.wallets.isLoading);
  }

  ngOnInit(): void {
    // Check admin authorization
    this.checkAdminAuthorization();

    if (!this.isAuthorized) {
      this.redirectUnauthorizedUser();
      return;
    }

    // Get user role
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    this.userRole = user?.role || null;

    // Initial load from route params
    this.loadWalletFromRouteParams();

    // Subscribe to route parameter changes
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const walletId = params.get('id');
      if (walletId) {
        this.fetchWalletData(walletId);
      }
    });

    // Subscribe to wallet changes to check activation eligibility and load rewards
    this.walletSubscription = this.wallet$.subscribe(wallet => {
      if (wallet) {
        // Check activation eligibility
        if (!wallet.isActive && wallet.deactivatedAt) {
          this.checkActivationEligibility(wallet);
        } else {
          this.canActivate = false;
          this.timeUntilActivation = null;
        }

        // Load user rewards data
        this.loadUserRewards(wallet.user._id);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.walletSubscription) {
      this.walletSubscription.unsubscribe();
    }
  }

  private checkAdminAuthorization(): void {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    this.userRole = user?.role || null;

    // Only ADMIN users can access admin wallet details
    this.isAuthorized = this.userRole === 'ADMIN';
  }

  private redirectUnauthorizedUser(): void {
    // Redirect non-admin users to their own wallet dashboard
    this.router.navigate(['/wallets/wallet-dashboard']);
  }

  private loadWalletFromRouteParams(): void {
    const walletId = this.route.snapshot.paramMap.get('id');
    if (walletId) {
      this.fetchWalletData(walletId);
    }
  }

  private fetchWalletData(walletId: string): void {
    console.log('Fetching wallet data for ID:', walletId);
    this.store.dispatch(WalletsActions.fetchWalletById({ id: walletId }));
  }

  private async loadUserRewards(userId: string): Promise<void> {
    this.isLoadingRewards = true;

    try {
      // Load user rewards and history
      const [rewardsData, rewardsHistory] = await Promise.all([
        this.walletsService.getUserRewardsWithConversion(userId).toPromise(),
        this.walletsService.getRewardsHistory(userId).toPromise()
      ]);

      // Calculate rewards summary
      const totalEarned = (rewardsHistory || [])
        .filter((history: IRewardsHistory) => history.type === 'EARNED')
        .reduce((sum: number, history: IRewardsHistory) => sum + history.points, 0);

      const totalConverted = (rewardsHistory || [])
        .filter((history: IRewardsHistory) => history.type === 'REDEEMED')
        .reduce((sum: number, history: IRewardsHistory) => sum + history.points, 0);

      this.userRewards = {
        points: rewardsData?.rewards?.points || 0,
        totalEarned,
        totalConverted
      };

    } catch (error) {
      console.error('Error loading user rewards:', error);
      this.userRewards = {
        points: 0,
        totalEarned: 0,
        totalConverted: 0
      };
    } finally {
      this.isLoadingRewards = false;
    }
  }

  private checkActivationEligibility(wallet: IWallet): void {
    if (!wallet.deactivatedAt) {
      this.canActivate = false;
      this.timeUntilActivation = null;
      return;
    }

    const deactivatedAt = new Date(wallet.deactivatedAt);
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - deactivatedAt.getTime();
    const hoursDifference = timeDifference / (1000 * 3600);

    if (hoursDifference >= 48) {
      this.canActivate = true;
      this.timeUntilActivation = null;
    } else {
      this.canActivate = false;
      const hoursRemaining = Math.ceil(48 - hoursDifference);
      this.timeUntilActivation = this.formatTimeRemaining(hoursRemaining);
    }
  }

  private formatTimeRemaining(hours: number): string {
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days} day${days > 1 ? 's' : ''} and ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
  }

  toggleWalletStatus(wallet: IWallet): void {
    if (!wallet) return;

    this.isToggling = true;
    this.statusError = null;
    this.statusSuccess = null;

    const walletId = wallet._id;

    if (wallet.isActive) {
      this.deactivateWallet(walletId);
    } else {
      if (!this.canActivate) {
        this.isToggling = false;
        this.statusError = `You can only activate the wallet after 48 hours of deactivation. ${this.timeUntilActivation ? `Time remaining: ${this.timeUntilActivation}.` : ''}`;
        return;
      }
      this.activateWallet(walletId);
    }
  }

  private deactivateWallet(walletId: string): void {
    this.walletsService.deactivateWallet(walletId).subscribe({
      next: (response: any) => {
        this.isToggling = false;
        this.statusSuccess = 'Wallet deactivated successfully';
        this.fetchWalletData(walletId);
      },
      error: (error: any) => {
        this.isToggling = false;
        this.statusError = error.error?.error || 'Failed to deactivate wallet';
      }
    });
  }

  private activateWallet(walletId: string): void {
    this.walletsService.activateWallet(walletId).subscribe({
      next: (response: any) => {
        this.isToggling = false;
        this.statusSuccess = 'Wallet activated successfully';
        this.fetchWalletData(walletId);
      },
      error: (error: any) => {
        this.isToggling = false;
        this.statusError = error.error?.error || 'Failed to activate wallet';
      }
    });
  }

  goBackToWalletsList(): void {
    this.router.navigate(['/wallets']);
  }

  formatDate(dateInput: string | Date): string {
    if (!dateInput) return 'Unknown';

    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
