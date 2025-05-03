import { ActionReducerMap } from "@ngrx/store";

import { WalletsState, walletsReducer } from "../features/wallets/store/wallets.reducers";


export interface AppState {

    wallets: WalletsState;
}
export const reducers: ActionReducerMap<AppState> = {
    wallets: walletsReducer
};
