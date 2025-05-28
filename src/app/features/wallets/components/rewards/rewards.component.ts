import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { AppState } from 'src/app/core/app.state';
import * as WalletActions from '../../store/wallets.actions';
import { IRewardsWithConversion, IRewardsHistory } from '../../models/rewards.model';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.css']
})
export class RewardsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  userRewards$: Observable<IRewardsWithConversion | null>;
  rewardsHistory$: Observable<IRewardsHistory[]>;
  rewardsLoading$: Observable<boolean>;
  rewardsError$: Observable<string | null>;

  userId: string | null = null;
  showHistory = false;
  convertAmount = 100; // Default conversion amount

  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {
    this.userRewards$ = this.store.select(state => state.wallets.userRewards);
    this.rewardsHistory$ = this.store.select(state => state.wallets.rewardsHistory);
    this.rewardsLoading$ = this.store.select(state => state.wallets.rewardsLoading);
    this.rewardsError$ = this.store.select(state => state.wallets.rewardsError);
  }

  ngOnInit(): void {
    // Get the logged-in user's ID from localStorage (same as top-up component)
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    this.userId = user?.id || user?._id || null;

    console.log('Rewards component - User info:', {
      userStr: !!userStr,
      user: user,
      userId: this.userId
    });

    if (this.userId) {
      this.loadRewards();
    } else {
      console.error('No user ID found in localStorage');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadRewards(): void {
    if (this.userId) {
      this.store.dispatch(WalletActions.fetchUserRewards({ userId: this.userId }));
    }
  }

  loadHistory(): void {
    if (this.userId) {
      this.store.dispatch(WalletActions.fetchRewardsHistory({ userId: this.userId }));
      this.showHistory = true;
    }
  }

  convertPoints(): void {
    console.log('=== CONVERT POINTS CLICKED ===');
    console.log('User ID:', this.userId);
    console.log('Convert Amount:', this.convertAmount);
    console.log('Amount >= 100:', this.convertAmount >= 100);

    if (!this.userId) {
      console.error('No user ID found!');
      alert('Error: No user ID found. Please log in again.');
      return;
    }

    if (this.convertAmount < 100) {
      console.error('Not enough points to convert');
      alert(`You need at least 100 points to convert. You selected: ${this.convertAmount}`);
      return;
    }

    console.log('Dispatching convertPointsToImoney action...');
    this.store.dispatch(WalletActions.convertPointsToImoney({
      userId: this.userId,
      points: this.convertAmount
    }));

    // Also listen for success/failure
    this.store.select(state => state.wallets.rewardsError).pipe(
      takeUntil(this.destroy$)
    ).subscribe(error => {
      if (error) {
        console.error('Conversion error:', error);
        alert(`Conversion failed: ${error}`);
      }
    });
  }

  onConvertAmountChange(event: any): void {
    this.convertAmount = parseInt(event.target.value, 10);
  }

  getSourceIcon(source: string): string {
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

  getSourceLabel(source: string): string {
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
        return 'Manual';
    }
  }

  getTypeClass(type: string): string {
    return type === 'EARNED' ? 'text-green-600' : 'text-blue-600';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Direct API test for conversion
  testDirectConversion(): void {
    console.log('=== DIRECT API CONVERSION TEST ===');

    // Get user ID the same way as top-up component
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?.id || user?._id || null;

    console.log('Direct API test - User info:', {
      userStr: !!userStr,
      user: user,
      userId: userId
    });

    if (!userId) {
      alert('No user ID found in localStorage!');
      return;
    }

    fetch(`http://localhost:3000/api/wallets/convert-points-to-imoney`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        points: 100
      })
    })
    .then(response => {
      console.log('API Response status:', response.status);
      return response.json();
    })
    .then(data => {
      console.log('Direct API conversion result:', data);
      if (data.message) {
        alert(`Success: ${data.message}\nPoints deducted: ${data.pointsDeducted}\niMoney added: ${data.imoneyAdded}`);
        // Refresh data
        this.loadRewards();
      } else {
        alert(`API call completed but unexpected response: ${JSON.stringify(data)}`);
      }
    })
    .catch(error => {
      console.error('Direct API conversion error:', error);
      alert(`Direct API test failed: ${error.message}`);
    });
  }

  // Navigation method
  goBackToDashboard(): void {
    this.router.navigate(['/wallets/wallet-dashboard']);
  }
}
