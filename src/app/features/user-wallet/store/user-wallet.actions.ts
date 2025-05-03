import { createAction, props } from '@ngrx/store';
import { ITransaction } from '../models/transaction.model';
import { IWallet } from '../../wallets/models/wallets.model';

// Fetch user wallet
export const fetchUserWallet = createAction(
  '[User Wallet] Fetch User Wallet',
  props<{ userId: string }>()
);

export const fetchUserWalletSuccess = createAction(
  '[User Wallet] Fetch User Wallet Success',
  props<{ wallet: IWallet }>()
);

export const fetchUserWalletFailure = createAction(
  '[User Wallet] Fetch User Wallet Failure',
  props<{ error: string }>()
);

// Fetch transaction history
export const fetchTransactions = createAction(
  '[User Wallet] Fetch Transactions',
  props<{ userId: string }>()
);

export const fetchTransactionsSuccess = createAction(
  '[User Wallet] Fetch Transactions Success',
  props<{ transactions: ITransaction[] }>()
);

export const fetchTransactionsFailure = createAction(
  '[User Wallet] Fetch Transactions Failure',
  props<{ error: string }>()
);

// Create wallet
export const createWallet = createAction(
  '[User Wallet] Create Wallet',
  props<{ walletData: any }>()
);

export const createWalletSuccess = createAction(
  '[User Wallet] Create Wallet Success',
  props<{ wallet: IWallet }>()
);

export const createWalletFailure = createAction(
  '[User Wallet] Create Wallet Failure',
  props<{ error: string }>()
);

// Activate wallet
export const activateWallet = createAction(
  '[User Wallet] Activate Wallet',
  props<{ walletId: string }>()
);

export const activateWalletSuccess = createAction(
  '[User Wallet] Activate Wallet Success',
  props<{ wallet: IWallet }>()
);

export const activateWalletFailure = createAction(
  '[User Wallet] Activate Wallet Failure',
  props<{ error: string }>()
);

// Deactivate wallet
export const deactivateWallet = createAction(
  '[User Wallet] Deactivate Wallet',
  props<{ walletId: string }>()
);

export const deactivateWalletSuccess = createAction(
  '[User Wallet] Deactivate Wallet Success',
  props<{ wallet: IWallet }>()
);

export const deactivateWalletFailure = createAction(
  '[User Wallet] Deactivate Wallet Failure',
  props<{ error: string }>()
);

// Set loading state
export const setLoading = createAction(
  '[User Wallet] Set Loading',
  props<{ isLoading: boolean }>()
);

// Clear errors
export const clearErrors = createAction(
  '[User Wallet] Clear Errors'
);