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
    // const userId = localStorage.getItem('userId');
    const userId = '680bc3701cafa75c695bac60';

    if (userId) {
      // First, we need to find the wallet associated with this user
      this.store.dispatch(WalletActions.SetWalletLoader({ isLoading: true }));
      
      this.walletService.getWalletByUserId(userId).subscribe({
        next: (wallet) => {
          if (wallet && wallet._id) {
            this.walletId = wallet._id;
            // Now fetch the wallet with all its details
            this.store.dispatch(WalletActions.fetchWalletById({ id: wallet._id }));
          } else {
            this.store.dispatch(WalletActions.SetWalletLoader({ isLoading: false }));
            this.store.dispatch(WalletActions.fetchWalletByIdFailure({ 
              error: 'No wallet found for this user' 
            }));
          }
        },
        error: (error) => {
          this.store.dispatch(WalletActions.SetWalletLoader({ isLoading: false }));
          this.store.dispatch(WalletActions.fetchWalletByIdFailure({ 
            error: error.message || 'Failed to fetch wallet information' 
          }));
        }
      });
    } else {
      this.store.dispatch(WalletActions.fetchWalletByIdFailure({ 
        error: 'User ID not found. Please log in again.' 
      }));
    }
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
}
