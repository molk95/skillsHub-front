import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppState } from 'src/app/core/app.state';
import { IWallet } from '../../models/wallets.model';
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
  isToggling = false;
  statusError: string | null = null;
  statusSuccess: string | null = null;
  canActivate = false;
  timeUntilActivation: string | null = null;
  private routeSubscription: Subscription | null = null;
  private walletSubscription: Subscription | null = null;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private walletsService: WalletsService
  ) {
    this.wallet$ = this.store.select(state => state.wallets.selectedWallet);
    this.isLoading$ = this.store.select(state => state.wallets.isLoading);
  }

  ngOnInit(): void {
    // Initial load from route params
    this.loadWalletFromRouteParams();
    
    // Subscribe to route parameter changes to handle navigation between different wallet details
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const walletId = params.get('id');
      if (walletId) {
        this.fetchWalletData(walletId);
      }
    });

    // Subscribe to wallet changes to check activation eligibility
    this.walletSubscription = this.wallet$.subscribe(wallet => {
      if (wallet && !wallet.isActive && wallet.deactivatedAt) {
        this.checkActivationEligibility(wallet);
      } else {
        this.canActivate = false;
        this.timeUntilActivation = null;
      }
    });
    
    // Set default role if not already set
    if (!localStorage.getItem('role')) {
      localStorage.setItem('role', 'CLIENT');
    }
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.walletSubscription) {
      this.walletSubscription.unsubscribe();
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
      next: (response) => {
        this.isToggling = false;
        this.statusSuccess = 'Wallet deactivated successfully';
        // Refresh wallet data
        this.fetchWalletData(walletId);
      },
      error: (error) => {
        this.isToggling = false;
        this.statusError = error.error?.error || 'Failed to deactivate wallet';
      }
    });
  }

  private activateWallet(walletId: string): void {
    this.walletsService.activateWallet(walletId).subscribe({
      next: (response) => {
        this.isToggling = false;
        this.statusSuccess = 'Wallet activated successfully';
        // Refresh wallet data
        this.fetchWalletData(walletId);
      },
      error: (error) => {
        this.isToggling = false;
        this.statusError = error.error?.error || 'Failed to activate wallet';
      }
    });
  }

  goBackToWallets(): void {
    // Navigate based on user role
    if (this.isAdmin()) {
      this.router.navigate(['/wallets']);
    } else {
      this.router.navigate(['/wallets/wallet-dashboard']);
    }
  }

  handleTopUpClick(wallet: IWallet): void {
    if (!wallet.isActive) {
      this.statusError = 'Cannot top up a deactivated wallet. Please activate the wallet first.';
      return;
    }
    
    this.router.navigate(['/wallets/packages']);
  }
  
  // Helper method to check if user is admin
  isAdmin(): boolean {
    return localStorage.getItem('role') === 'ADMIN';
  }
  
  // Helper method to check if user is client
  isClient(): boolean {
    return localStorage.getItem('role') === 'CLIENT';
  }
  
  // For testing - toggle role between ADMIN and CLIENT
  toggleRole(): void {
    const currentRole = localStorage.getItem('role');
    const newRole = currentRole === 'ADMIN' ? 'CLIENT' : 'ADMIN';
    localStorage.setItem('role', newRole);
    // Force refresh to see changes
    window.location.reload();
  }
}
