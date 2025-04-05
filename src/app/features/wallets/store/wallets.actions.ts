import { createAction, props } from "@ngrx/store";
import { IWallet } from "../models/wallets.model";

export const fetchAllWallets = createAction(
    '[Wallets] Fetch All Wallets',
)

export const fetchAllWalletsSuccess = createAction(
    '[Wallets] Fetch All Wallets Success',
    props<{ wallets: IWallet[] }>()
)

export const fetchAllWalletsFailure = createAction(
    '[Wallets] Fetch All Wallets Failure'
)

// loader actions
export const SetWalletLoader = createAction(
    '[ Loader ] - ShowLoader',
    props<{ isLoading: boolean }>()
);