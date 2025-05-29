import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as WalletActions from '../../store/wallets.actions';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css'],
})
export class SuccessComponent implements OnInit {
  message$: Observable<string | null>;
  error$: Observable<string | null>;
  loading$: Observable<boolean>;

  constructor(private store: Store<{ wallet: any }>, private route: ActivatedRoute) {
    // Select state directly from the wallet feature
    this.message$ = this.store.select(state => state.wallet.message);
    this.error$ = this.store.select(state => state.wallet.error);
    this.loading$ = this.store.select(state => state.wallet.loading);
  }

  ngOnInit() {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    if (sessionId) {
      this.store.dispatch(WalletActions.handleCheckoutSuccess({ sessionId }));
    } else {
      this.store.dispatch(
        WalletActions.handleCheckoutFailure({ error: 'Invalid session ID' })
      );
    }
  }

  // Methods for displaying transaction details
  getTransactionId(): string {
    // Get from query params or generate a display ID
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    return sessionId ? sessionId.substring(0, 12).toUpperCase() : 'TXN-' + Date.now().toString().substring(-8);
  }

  getPaymentAmount(): string {
    // Get from query params or localStorage
    const amount = this.route.snapshot.queryParamMap.get('amount') ||
                   localStorage.getItem('lastPaymentAmount') ||
                   '0';
    return amount;
  }

  getIMoneyReceived(): string {
    // Get from query params or localStorage
    const imoney = this.route.snapshot.queryParamMap.get('imoney') ||
                   localStorage.getItem('lastIMoneyReceived') ||
                   '0';
    return imoney;
  }

  getRewardPoints(): string {
    // Get from query params or localStorage
    const points = this.route.snapshot.queryParamMap.get('points') ||
                   localStorage.getItem('lastRewardPoints') ||
                   '0';
    return points;
  }
}