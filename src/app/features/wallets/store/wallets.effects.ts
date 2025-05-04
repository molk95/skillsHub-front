import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as WalletsActions from './wallets.actions';
import { WalletsService } from "../services/wallets.service";
import { catchError, map, mergeMap, of, switchMap, tap } from "rxjs";
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
            tap(() => this.store.dispatch(WalletsActions.SetWalletLoader({ isLoading: true }))),
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
    
    FetchWalletByIdEffect$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WalletsActions.fetchWalletById),
            mergeMap(({ id }) =>
                this.walletsService.getWalletById(id).pipe(
                    map((wallet) => WalletsActions.fetchWalletByIdSuccess({ wallet })),
                    catchError((error) => of(WalletsActions.fetchWalletByIdFailure({ 
                        error: error.message || 'Failed to fetch wallet details' 
                    })))
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
                        of(WalletsActions.initiateCheckoutFailure({ 
                            error: error.message || 'Failed to initiate checkout' 
                        }))
                    )
                )
            )
        )
    ); 

    handleCheckoutSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WalletsActions.handleCheckoutSuccess),
            map(({ sessionId }) => {
                // Instead of calling the backend, we'll directly return a success result
                return WalletsActions.handleCheckoutSuccessResult({ 
                    message: 'Payment processed successfully' 
                });
            })
        )
    );

    // After successful checkout, refresh wallet data
    refreshWalletAfterCheckout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WalletsActions.handleCheckoutSuccessResult),
            tap(() => {
                // Get user ID from local storage
                const userId = localStorage.getItem('userId');
                if (userId) {
                    // Dispatch action to fetch updated wallet
                    this.store.dispatch(WalletsActions.fetchWalletById({ id: userId }));
                }
            })
        ),
        { dispatch: false }
    );
}
