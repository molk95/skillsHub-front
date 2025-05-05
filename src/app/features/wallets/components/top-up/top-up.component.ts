import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as WalletActions from '../../store/wallets.actions';
import { environment } from '../../../../../environments/environment';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { AppState } from 'src/app/core/app.state';
import { IWallet } from '../../models/wallets.model';

interface Package {
  id: number;
  name: string;
  amount: number;
  imoneyValue: number;
  description: string;
  isPopular?: boolean;
}

@Component({
  selector: 'app-top-up',
  templateUrl: './top-up.component.html',
  styleUrls: ['./top-up.component.css'],
})
export class TopUpComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
 /* selectedPackage: Package | null = null;
  checkoutUrl$: Observable<string | null>;
  error$: Observable<string | null>;
  loading$: Observable<boolean>;
  wallet$: Observable<IWallet | null>;
  stripe: Stripe | null = null;
  walletError: string | null = null;

  constructor(private store: Store<AppState>, private router: Router) {
    this.checkoutUrl$ = this.store.select(state => state.wallets.checkoutUrl);
    this.error$ = this.store.select(state => state.wallets.error);
    this.loading$ = this.store.select(state => state.wallets.isLoading);
    this.wallet$ = this.store.select(state => state.wallets.selectedWallet);
  }

  async ngOnInit() {
    // Check if wallet is active
    this.wallet$.subscribe(wallet => {
      if (wallet && !wallet.isActive) {
        this.walletError = 'Cannot top up a deactivated wallet. Please activate the wallet first.';
        setTimeout(() => {
          this.router.navigate(['/wallets']);
        }, 3000);
      }
    });

    // Load the selected package from localStorage
    const packageData = localStorage.getItem('selectedPackage');
    if (packageData) {
      this.selectedPackage = JSON.parse(packageData);
    } else {
      // If no package is selected, redirect back to package selection
      this.router.navigate(['/wallets/packages']);
      return;
    }

    // Load Stripe with the correct key name from environment
    this.stripe = await loadStripe(environment.stripePublishableKey);
    
    // Subscribe to checkout URL and redirect when available
    this.checkoutUrl$.subscribe((url) => {
      if (url) {
        console.log('Redirecting to Stripe checkout:', url);
        window.location.href = url;
      }
    });
  }

  initiateCheckout() {
    if (this.walletError) {
      return;
    }

    if (!this.selectedPackage) {
      this.store.dispatch(
        WalletActions.initiateCheckoutFailure({ error: 'No package selected' })
      );
      return;
    }

    // const userId = localStorage.getItem('userId');
    const userId = '680bc3701cafa75c695bac60';
    if (!userId) {
      this.store.dispatch(
        WalletActions.initiateCheckoutFailure({ error: 'User ID not found' })
      );
      return;
    }

    console.log('Initiating checkout with:', {
      userId,
      amount: this.selectedPackage.amount,
      imoneyValue: this.selectedPackage.imoneyValue
    });

    this.store.dispatch(
      WalletActions.initiateCheckout({
        userId,
        amount: this.selectedPackage.amount,
        imoneyValue: this.selectedPackage.imoneyValue,
      })
    );
  }

  goBackToPackages() {
    this.router.navigate(['/wallets/packages']);
  }*/
}
