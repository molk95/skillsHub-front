import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as WalletsActions from './wallets.actions'
import { WalletsService } from "../services/wallets.service";
import { catchError, finalize, map, of, switchMap, tap } from "rxjs";
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
    
    
}