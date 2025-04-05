import { ActionReducerMap } from "@ngrx/store";

import { WalletsState, walletReducer } from "../features/wallets/store/wallets.reducers";


export interface AppState {

    wallets: WalletsState;
}
export const reducers: ActionReducerMap<AppState> = {
    wallets: walletReducer
};
