import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as WalletsActions from './wallets.actions'
import { WalletsService } from "../services/wallets.service";
import { catchError, finalize, map, mergeMap, of, switchMap, tap } from "rxjs";
import { IWallet } from "../models/wallets.model";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/core/app.state";


@Injectable()
export class WalletsEffects {
    constructor(
        private actions$: Actions,
        public store: Store<AppState>,
        private walletsService: WalletsService
    
    ) {}
    FetchWalletsEffect$ = createEffect(() =>
        this.actions$.pipe(
        ofType(WalletsActions.fetchAllWallets),
        tap(() =>
        this.store.dispatch(WalletsActions.SetWalletLoader({ isLoading: true }))
        ),
        switchMap(() =>
        this.walletsService.listWallets().pipe(
            map((res) => WalletsActions.fetchAllWalletsSuccess({ wallets: res as IWallet[] })),
            catchError(() =>
            of(WalletsActions.fetchAllWalletsFailure()).pipe(
                tap(() => {
                this.store.dispatch(WalletsActions.SetWalletLoader({ isLoading: false }));
                })
            )
            )
        )
        )
    )
    );
    
initiateCheckout$ = createEffect(() =>
    this.actions$.pipe(
        ofType(WalletsActions.initiateCheckout),
        mergeMap(({ userId, amount, imoneyValue }) =>
        this.walletsService.createCheckoutSession(userId, amount, imoneyValue).pipe(
            map((response) =>
            WalletsActions.initiateCheckoutSuccess({
                checkoutUrl: response.url,
                sessionId: response.sessionId,
            })
            ),
            catchError((error) =>
            of(WalletsActions.initiateCheckoutFailure({ error: error.message || 'Failed to initiate checkout' }))
            )
        )
        )
    )
    ); 

handleCheckoutSuccess$ = createEffect(() =>
    this.actions$.pipe(
        ofType(WalletsActions.handleCheckoutSuccess),
        switchMap(({ sessionId }) =>
        this.walletsService.handleCheckoutSuccess(sessionId).pipe(
            // map((response) =>
            // WalletsActions.handleCheckoutSuccess({ message: response.message })
            // ),
            catchError((error) =>
            of(WalletsActions.handleCheckoutFailure({ error: error.error || 'Failed to process payment' }))
            )
        )
        )
    )
    );
}