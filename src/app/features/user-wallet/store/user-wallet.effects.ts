import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { UserWalletService } from '../services/user-wallet.service';
import * as UserWalletActions from './user-wallet.actions';

@Injectable()
export class UserWalletEffects {
  constructor(
    private actions$: Actions,
    private userWalletService: UserWalletService
  ) {}

  fetchUserWallet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserWalletActions.fetchUserWallet),
      switchMap(({ userId }) =>
        this.userWalletService.getUserWallet(userId).pipe(
          map(wallet => UserWalletActions.fetchUserWalletSuccess({ wallet })),
          catchError(error => of(UserWalletActions.fetchUserWalletFailure({ 
            error: error.error?.message || 'Failed to fetch wallet' 
          })))
        )
      )
    )
  );

  fetchTransactions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserWalletActions.fetchTransactions),
      switchMap(({ userId }) =>
        this.userWalletService.getTransactionHistory(userId).pipe(
          map(transactions => UserWalletActions.fetchTransactionsSuccess({ transactions })),
          catchError(error => of(UserWalletActions.fetchTransactionsFailure({ 
            error: error.error?.message || 'Failed to fetch transactions' 
          })))
        )
      )
    )
  );

  createWallet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserWalletActions.createWallet),
      mergeMap(({ walletData }) =>
        this.userWalletService.createWallet(walletData).pipe(
          map(wallet => UserWalletActions.createWalletSuccess({ wallet })),
          catchError(error => of(UserWalletActions.createWalletFailure({ 
            error: error.error?.message || 'Failed to create wallet' 
          })))
        )
      )
    )
  );

  activateWallet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserWalletActions.activateWallet),
      mergeMap(({ walletId }) =>
        this.userWalletService.activateWallet(walletId).pipe(
          map(wallet => UserWalletActions.activateWalletSuccess({ wallet })),
          catchError(error => of(UserWalletActions.activateWalletFailure({ 
            error: error.error?.message || 'Failed to activate wallet' 
          })))
        )
      )
    )
  );

  deactivateWallet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserWalletActions.deactivateWallet),
      mergeMap(({ walletId }) =>
        this.userWalletService.deactivateWallet(walletId).pipe(
          map(wallet => UserWalletActions.deactivateWalletSuccess({ wallet })),
          catchError(error => of(UserWalletActions.deactivateWalletFailure({ 
            error: error.error?.message || 'Failed to deactivate wallet' 
          })))
        )
      )
    )
  );
}