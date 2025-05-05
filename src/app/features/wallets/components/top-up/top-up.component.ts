import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as WalletActions from '../../store/wallets.actions';
import { environment } from '../../../../../environments/environment';
//import { loadStripe, Stripe } from '@stripe/stripe-js';

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
  stripe: Stripe | null = null;

  constructor(private store: Store<{ wallet: any }>, private router: Router) {
    this.checkoutUrl$ = this.store.select(state => state.wallet.checkoutUrl);
    this.error$ = this.store.select(state => state.wallet.error);
    this.loading$ = this.store.select(state => state.wallet.loading);
  }

  async ngOnInit() {
    // Load the selected package from localStorage
    const packageData = localStorage.getItem('selectedPackage');
    if (packageData) {
      this.selectedPackage = JSON.parse(packageData);
    } else {
      // If no package is selected, redirect back to package selection
      this.router.navigate(['/wallets/packages']);
      return;
    }

    this.stripe = await loadStripe('pk_test_51RFLpqGhFIRJflIh6ssFa5KVDZdOWA2KZyZzO9RlJ2yk5SXiE6gT9y0UZP9pJl8RXDYgQdWRiVpZ00PRkgtkIjOB00d8La2yK4');
    this.checkoutUrl$.subscribe((url) => {
      if (url && this.stripe) {
        window.location.href = url;
      }
    });

    // Automatically initiate checkout with the selected package
    this.initiateCheckout();
  }

  initiateCheckout() {
    if (!this.selectedPackage) {
      this.store.dispatch(
        WalletActions.initiateCheckoutFailure({ error: 'No package selected' })
      );
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.store.dispatch(
        WalletActions.initiateCheckoutFailure({ error: 'User ID not found' })
      );
      return;
    }

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
