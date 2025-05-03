import { createReducer, on } from '@ngrx/store';
import * as UserWalletActions from './user-wallet.actions';
import { ITransaction } from '../models/transaction.model';
import { IWallet } from '../../wallets/models/wallets.model';

export interface UserWalletState {
  wallet: IWallet | null;
  transactions: ITransaction[];
  isLoading: boolean;
  error: string | null;
  message: string | null;
}

export const initialState: UserWalletState = {
  wallet: null,
  transactions: [],
  isLoading: false,
  error: null,
  message: null
};

export const userWalletReducer = createReducer(
  initialState,
  
  // Fetch user wallet
  on(UserWalletActions.fetchUserWallet, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  
  on(UserWalletActions.fetchUserWalletSuccess, (state, { wallet }) => ({
    ...state,
    wallet,
    isLoading: false,
    error: null
  })),
  
  on(UserWalletActions.fetchUserWalletFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  
  // Fetch transactions
  on(UserWalletActions.fetchTransactions, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  
  on(UserWalletActions.fetchTransactionsSuccess, (state, { transactions }) => ({
    ...state,
    transactions,
    isLoading: false,
    error: null
  })),
  
  on(UserWalletActions.fetchTransactionsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  
  // Create wallet
  on(UserWalletActions.createWallet, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  
  on(UserWalletActions.createWalletSuccess, (state, { wallet }) => ({
    ...state,
    wallet,
    isLoading: false,
    error: null,
    message: 'Wallet created successfully'
  })),
  
  on(UserWalletActions.createWalletFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  
  // Activate wallet
  on(UserWalletActions.activateWallet, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  
  on(UserWalletActions.activateWalletSuccess, (state, { wallet }) => ({
    ...state,
    wallet,
    isLoading: false,
    error: null,
    message: 'Wallet activated successfully'
  })),
  
  on(UserWalletActions.activateWalletFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  
  // Deactivate wallet
  on(UserWalletActions.deactivateWallet, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  
  on(UserWalletActions.deactivateWalletSuccess, (state, { wallet }) => ({
    ...state,
    wallet,
    isLoading: false,
    error: null,
    message: 'Wallet deactivated successfully'
  })),
  
  on(UserWalletActions.deactivateWalletFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  
  // Set loading
  on(UserWalletActions.setLoading, (state, { isLoading }) => ({
    ...state,
    isLoading
  })),
  
  // Clear errors
  on(UserWalletActions.clearErrors, (state) => ({
    ...state,
    error: null,
    message: null
  }))
);