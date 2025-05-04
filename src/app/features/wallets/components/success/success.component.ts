import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as WalletActions from '../../store/wallets.actions';
import { AppState } from 'src/app/core/app.state';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css'],
})
export class SuccessComponent implements OnInit {
  message$: Observable<string | null>;
  error$: Observable<string | null>;
  loading$: Observable<boolean>;

  constructor(
    private store: Store<AppState>, 
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Select state from the wallets feature
    this.message$ = this.store.select(state => state.wallets.message);
    this.error$ = this.store.select(state => state.wallets.error);
    this.loading$ = this.store.select(state => state.wallets.isLoading);
  }

  ngOnInit() {
    console.log('Success component initialized');
    console.log('Current URL:', this.router.url);
    
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    console.log('Session ID from query params:', sessionId);
    
    if (sessionId) {
      // Instead of dispatching an action that calls the backend,
      // we'll directly update the wallet in the frontend
      const userId = localStorage.getItem('userId');
      if (userId) {
        // Dispatch action to fetch updated wallet
        this.store.dispatch(WalletActions.fetchWalletById({ id: userId }));
        this.store.dispatch(
          WalletActions.handleCheckoutSuccessResult({ 
            message: 'Payment processed successfully' 
          })
        );
      } else {
        this.store.dispatch(
          WalletActions.handleCheckoutFailure({ 
            error: 'User ID not found. Please log in again.' 
          })
        );
      }
    } else {
      console.error('No session_id found in query parameters');
      this.store.dispatch(
        WalletActions.handleCheckoutFailure({ error: 'Invalid session ID' })
      );
    }
  }
}
