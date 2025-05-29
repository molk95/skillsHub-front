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
            mergeMap(({ userId, amount, imoneyValue, packageName, points }) =>
                this.walletsService.createCheckoutSession(userId, amount, imoneyValue, packageName, points).pipe(
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
            switchMap(({ sessionId }) =>
                this.walletsService.handleCheckoutSuccess(sessionId).pipe(
                    map((response) =>
                        WalletsActions.handleCheckoutSuccessResult({
                            message: response.message || 'Payment processed successfully'
                        })
                    ),
                    catchError((error) =>
                        of(WalletsActions.handleCheckoutFailure({
                            error: error.error || 'Failed to process payment'
                        }))
                    )
                )
            )
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
                    // Also refresh rewards data
                    this.store.dispatch(WalletsActions.fetchUserRewards({ userId }));
                }
            })
        ),
        { dispatch: false }
    );

    // Fetch user rewards
    fetchUserRewards$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WalletsActions.fetchUserRewards),
            mergeMap(({ userId }) =>
                this.walletsService.getUserRewardsWithConversion(userId).pipe(
                    map((rewards) => WalletsActions.fetchUserRewardsSuccess({ rewards })),
                    catchError((error) =>
                        of(WalletsActions.fetchUserRewardsFailure({
                            error: error.message || 'Failed to fetch rewards'
                        }))
                    )
                )
            )
        )
    );

    // Fetch rewards history
    fetchRewardsHistory$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WalletsActions.fetchRewardsHistory),
            mergeMap(({ userId }) =>
                this.walletsService.getRewardsHistory(userId).pipe(
                    map((history) => WalletsActions.fetchRewardsHistorySuccess({ history })),
                    catchError((error) =>
                        of(WalletsActions.fetchRewardsHistoryFailure({
                            error: error.message || 'Failed to fetch rewards history'
                        }))
                    )
                )
            )
        )
    );

    // Convert points to iMoney
    convertPointsToImoney$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WalletsActions.convertPointsToImoney),
            mergeMap(({ userId, points }) =>
                this.walletsService.convertPointsToImoney(userId, points).pipe(
                    map((result) => WalletsActions.convertPointsToImoneySuccess({ result })),
                    catchError((error) =>
                        of(WalletsActions.convertPointsToImoneyFailure({
                            error: error.message || 'Failed to convert points'
                        }))
                    )
                )
            )
        )
    );

    // After successful conversion, refresh rewards and wallet data
    refreshAfterConversion$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WalletsActions.convertPointsToImoneySuccess),
            tap(() => {
                const userId = localStorage.getItem('userId');
                if (userId) {
                    // Refresh both rewards and wallet data
                    this.store.dispatch(WalletsActions.fetchUserRewards({ userId }));
                    this.store.dispatch(WalletsActions.fetchWalletById({ id: userId }));
                }
            })
        ),
        { dispatch: false }
    );
}
