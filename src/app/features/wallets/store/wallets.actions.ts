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

export const fetchWalletById = createAction(
    '[Wallets] Fetch Wallet By Id',
    props<{ id: string }>()
);

export const fetchWalletByIdSuccess = createAction(
    '[Wallets] Fetch Wallet By Id Success',
    props<{ wallet: IWallet }>()
);

export const fetchWalletByIdFailure = createAction(
    '[Wallets] Fetch Wallet By Id Failure',
    props<{ error: string }>()
);

// loader actions
export const SetWalletLoader = createAction(
    '[ Loader ] - ShowLoader',
    props<{ isLoading: boolean }>()
);

export const initiateCheckout = createAction(
'[Wallet] Initiate Checkout',
props<{ userId: string; amount: number; imoneyValue: number }>()
);

export const initiateCheckoutSuccess = createAction(
'[Wallet] Initiate Checkout Success',
props<{ checkoutUrl: string; sessionId: string }>()
);

export const initiateCheckoutFailure = createAction(
'[Wallet] Initiate Checkout Failure',
props<{ error: string }>()
);

export const handleCheckoutSuccess = createAction(
'[Wallet] Handle Checkout Success',
props<{ sessionId: string }>()
);

export const handleCheckoutSuccessResult = createAction(
'[Wallet] Handle Checkout Success Result',
props<{ message: string }>()
);

export const handleCheckoutFailure = createAction(
'[Wallet] Handle Checkout Failure',
props<{ error: string }>()
);
