import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppState } from 'src/app/core/app.state';
import { IWallet } from '../../models/wallets.model';
import { IRewardsWithConversion, IRewardsHistory } from '../../models/rewards.model';
import * as WalletsActions from '../../store/wallets.actions';
import { WalletsService } from '../../services/wallets.service';

interface UserRewardsSummary {
  userId: string;
  userName: string;
  userEmail: string;
  currentPoints: number;
  totalPointsEarned: number;
  totalPointsConverted: number;
  totalImoneyFromConversion: number;
  lastActivity: Date | null;
  walletBalance: number;
}

@Component({
  selector: 'app-admin-rewards-management',
  templateUrl: './admin-rewards-management.component.html',
  styleUrls: ['./admin-rewards-management.component.css']
})
export class AdminRewardsManagementComponent implements OnInit, OnDestroy {
  wallets$: Observable<IWallet[]>;
  isLoading$: Observable<boolean>;
  userRole: string | null = null;
  isAuthorized = false;

  // Rewards data
  userRewardsSummaries: UserRewardsSummary[] = [];
  isLoadingRewards = false;
  rewardsError: string | null = null;

  // Analytics data
  totalSystemPoints = 0;
  totalSystemConversions = 0;
  totalActiveUsers = 0;
  averagePointsPerUser = 0;

  private subscriptions: Subscription[] = [];

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private walletsService: WalletsService
  ) {
    this.wallets$ = this.store.select((state) => state.wallets.wallets);
    this.isLoading$ = this.store.select((state) => state.wallets.isLoading);
  }

  ngOnInit(): void {
    // Check admin authorization
    this.checkAdminAuthorization();

    if (!this.isAuthorized) {
      this.redirectUnauthorizedUser();
      return;
    }

    // Load wallets and rewards data
    this.loadWalletsAndRewards();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private checkAdminAuthorization(): void {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    this.userRole = user?.role || null;

    // Only ADMIN users can access admin rewards management
    this.isAuthorized = this.userRole === 'ADMIN';
  }

  private redirectUnauthorizedUser(): void {
    // Redirect non-admin users to their own wallet dashboard
    this.router.navigate(['/wallets/wallet-dashboard']);
  }

  private loadWalletsAndRewards(): void {
    // Load all wallets first
    this.store.dispatch(WalletsActions.fetchAllWallets());

    // Subscribe to wallets and load rewards for each user
    const walletsSubscription = this.wallets$.subscribe(wallets => {
      if (wallets && wallets.length > 0) {
        this.loadRewardsForAllUsers(wallets);
      }
    });

    this.subscriptions.push(walletsSubscription);
  }

  private async loadRewardsForAllUsers(wallets: IWallet[]): Promise<void> {
    this.isLoadingRewards = true;
    this.userRewardsSummaries = [];

    try {
      const rewardsPromises = wallets.map(async (wallet) => {
        const userId = wallet.user._id;

        try {
          // Load user rewards and history
          const [rewardsData, rewardsHistory] = await Promise.all([
            this.walletsService.getUserRewardsWithConversion(userId).toPromise(),
            this.walletsService.getRewardsHistory(userId).toPromise()
          ]);

          return this.createUserRewardsSummary(wallet, rewardsData || null, rewardsHistory || []);
        } catch (error) {
          console.error(`Error loading rewards for user ${userId}:`, error);
          return this.createUserRewardsSummary(wallet, null, []);
        }
      });

      const summaries = await Promise.all(rewardsPromises);
      this.userRewardsSummaries = summaries.filter(summary => summary !== null) as UserRewardsSummary[];

      // Calculate analytics
      this.calculateAnalytics();

    } catch (error) {
      console.error('Error loading rewards data:', error);
      this.rewardsError = 'Failed to load rewards data';
    } finally {
      this.isLoadingRewards = false;
    }
  }

  private createUserRewardsSummary(
    wallet: IWallet,
    rewardsData: IRewardsWithConversion | null,
    rewardsHistory: IRewardsHistory[]
  ): UserRewardsSummary {
    // Calculate total points earned (type: 'EARNED')
    const totalPointsEarned = rewardsHistory
      .filter(history => history.type === 'EARNED')
      .reduce((sum, history) => sum + history.points, 0);

    // Calculate total points converted/redeemed (type: 'REDEEMED')
    const totalPointsConverted = rewardsHistory
      .filter(history => history.type === 'REDEEMED')
      .reduce((sum, history) => sum + history.points, 0);

    // For iMoney conversion, we'll estimate based on conversion rates
    // This is a simplified calculation - you might want to store actual iMoney received
    const totalImoneyFromConversion = Math.floor(totalPointsConverted / 100); // Assuming 100 points = 1 iMoney

    const lastActivity = rewardsHistory.length > 0
      ? new Date(Math.max(...rewardsHistory.map(h => new Date(h.createdAt).getTime())))
      : null;

    return {
      userId: wallet.user._id,
      userName: wallet.user.fullName,
      userEmail: wallet.user.email,
      currentPoints: rewardsData?.rewards?.points || 0,
      totalPointsEarned,
      totalPointsConverted,
      totalImoneyFromConversion,
      lastActivity,
      walletBalance: wallet.imoney?.value || 0
    };
  }

  private calculateAnalytics(): void {
    this.totalSystemPoints = this.userRewardsSummaries.reduce((sum, user) => sum + user.currentPoints, 0);
    this.totalSystemConversions = this.userRewardsSummaries.reduce((sum, user) => sum + user.totalImoneyFromConversion, 0);
    this.totalActiveUsers = this.userRewardsSummaries.filter(user => user.lastActivity !== null).length;
    this.averagePointsPerUser = this.userRewardsSummaries.length > 0
      ? Math.round(this.totalSystemPoints / this.userRewardsSummaries.length)
      : 0;
  }

  viewUserRewardsDetails(userId: string): void {
    // Navigate to user-specific rewards details
    this.router.navigate(['/wallets/admin-details', userId]);
  }

  goBackToWalletsList(): void {
    this.router.navigate(['/wallets']);
  }

  refreshRewardsData(): void {
    this.loadWalletsAndRewards();
  }

  formatDate(date: Date | null): string {
    if (!date) return 'Never';

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
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }

  formatNumber(num: number): string {
    return num.toLocaleString('en-US');
  }

  getUserInitial(userName: string): string {
    return (userName || 'U').charAt(0).toUpperCase();
  }

  exportRewardsData(): void {
    // TODO: Implement CSV export of rewards data
    console.log('Exporting rewards data...', this.userRewardsSummaries);

    // Create CSV content
    const headers = ['User Name', 'Email', 'Current Points', 'Total Earned', 'Total Converted', 'iMoney from Conversion', 'Wallet Balance', 'Last Activity'];
    const csvContent = [
      headers.join(','),
      ...this.userRewardsSummaries.map(user => [
        user.userName,
        user.userEmail,
        user.currentPoints,
        user.totalPointsEarned,
        user.totalPointsConverted,
        user.totalImoneyFromConversion,
        user.walletBalance,
        this.formatDate(user.lastActivity)
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartskillz-rewards-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
