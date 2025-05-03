import { ActionReducerMap } from "@ngrx/store";

import { WalletsState, walletsReducer } from "../features/wallets/store/wallets.reducers";
import { UserWalletState, userWalletReducer } from "../features/user-wallet/store/user-wallet.reducers";

export interface AppState {
    wallets: WalletsState;
    userWallet: UserWalletState;
}
export const reducers: ActionReducerMap<AppState> = {
    wallets: walletsReducer,
    userWallet: userWalletReducer
};
