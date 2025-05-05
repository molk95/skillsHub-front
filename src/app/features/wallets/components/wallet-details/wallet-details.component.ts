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
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
 /* wallet$: Observable<IWallet | null>;
  isLoading$: Observable<boolean>;
  isToggling = false;
  statusError: string | null = null;
  statusSuccess: string | null = null;
  private routeSubscription: Subscription | null = null;

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
    this.router.navigate(['/wallets']);
  }*/
}
