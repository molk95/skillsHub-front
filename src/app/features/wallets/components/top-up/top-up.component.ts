import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as WalletActions from '../../store/wallets.actions';
import { environment } from '../../../../../environments/environment';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-top-up',
  templateUrl: './top-up.component.html',
  styleUrls: ['./top-up.component.css'],
})
export class TopUpComponent implements OnInit {
  amount: number | null = 10; // Default amount
  checkoutUrl$: Observable<string | null>;
  error$: Observable<string | null>;
  loading$: Observable<boolean>;
  stripe: Stripe | null = null;
  amountOptions = [5, 10, 20, 50, 100]; // Predefined amount options

  constructor(private store: Store<{ wallet: any }>) {
    this.checkoutUrl$ = this.store.select(state => state.wallet.checkoutUrl);
    this.error$ = this.store.select(state => state.wallet.error);
    this.loading$ = this.store.select(state => state.wallet.loading);
  }

  async ngOnInit() {
    this.stripe = await loadStripe('pk_test_51RFLpqGhFIRJflIh6ssFa5KVDZdOWA2KZyZzO9RlJ2yk5SXiE6gT9y0UZP9pJl8RXDYgQdWRiVpZ00PRkgtkIjOB00d8La2yK4');
    this.checkoutUrl$.subscribe((url) => {
      if (url && this.stripe && this.store.select(state => state?.wallet?.checkoutUrl)) {
        window.location.href = url;
      }
    });
  }

  onAmountChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.amount = Number(selectElement.value) || null;
  }

  initiateCheckout() {
    if (!this.amount) {
      this.store.dispatch(
        WalletActions.initiateCheckoutFailure({ error: 'Amount is required' })
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
        amount: this.amount,
        imoneyValue: this.amount, // imoneyValue mirrors amount
      })
    );
  }
}

// import { Component, OnInit } from '@angular/core';
// import { Store } from '@ngrx/store';
// import { Observable } from 'rxjs';
// import * as WalletActions from '../../store/wallets.actions';
// import { environment } from '../../../../../environments/environment';
// import { loadStripe, Stripe } from '@stripe/stripe-js';

// @Component({
//   selector: 'app-top-up',
//   templateUrl: './top-up.component.html',
//   styleUrls: ['./top-up.component.css'],
// })
// export class TopUpComponent implements OnInit {
//   amount: number | null = 10; // Default amount
//   imoneyValue: number | null = 10; // Mirrors amount
//   checkoutUrl$: Observable<string | null>;
//   error$: Observable<string | null>;
//   loading$: Observable<boolean>;
//   stripe: Stripe | null = null;
//   amountOptions = [5, 10, 20, 50, 100]; // Predefined amount options

//   constructor(private store: Store<{ wallet: any }>) {
//     // Select state directly from the wallet feature
//     this.checkoutUrl$ = this.store.select(state => state.wallet.checkoutUrl);
//     this.error$ = this.store.select(state => state.wallet.error);
//     this.loading$ = this.store.select(state => state.wallet.loading);
//   }

//   async ngOnInit() {
//     // Initialize Stripe with your publishable key
//     this.stripe = await loadStripe('pk_test_51RFLpqGhFIRJflIh6ssFa5KVDZdOWA2KZyZzO9RlJ2yk5SXiE6gT9y0UZP9pJl8RXDYgQdWRiVpZ00PRkgtkIjOB00d8La2yK4');

//     // Subscribe to checkout URL changes to redirect to Stripe
//     this.checkoutUrl$.subscribe((url) => {
//       if (url && this.stripe) {
//         window.location.href = url; // Redirect to Stripe checkout
//       }
//     });
//   }

//   // Update amount and imoneyValue when dropdown changes
//   onAmountChange(event: Event) {
//     const selectElement = event.target as HTMLSelectElement;
//     this.amount = Number(selectElement.value);
//     this.imoneyValue = this.amount; // imoneyValue mirrors amount
//   }

//   initiateCheckout() {
//     // Validate amount
//     if (!this.amount) {
//       this.store.dispatch(
//         WalletActions.initiateCheckoutFailure({ error: 'Amount is required' })
//       );
//       return;
//     }

//     // Retrieve userId from localStorage
//     const userId = localStorage.getItem('userId');
//     if (!userId) {
//       this.store.dispatch(
//         WalletActions.initiateCheckoutFailure({ error: 'User ID not found in localStorage' })
//       );
//       return;
//     }

//     // Dispatch initiateCheckout action with dynamic values
//     this.store.dispatch(
//       WalletActions.initiateCheckout({
//         userId,
//         amount: Number(this.amount),
//         imoneyValue: Number(this.imoneyValue),
//       })
//     );
//   }
// }
