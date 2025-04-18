import { createReducer, on, Action } from "@ngrx/store";
import * as WalletsActions from './wallets.actions';
import { IWallet } from "../models/wallets.model";

export interface WalletsState {
  wallets: IWallet[];
  isLoading: boolean;
  checkoutUrl: string | null;
  sessionId: string | null;
  message: string | null;
  error: string | null;
}

export const initialState: WalletsState = {
  wallets: [],
  isLoading: false,
  checkoutUrl: null,
  sessionId: null,
  message: null,
  error: null,
};

const featureReducer = createReducer(
  initialState,
  on(WalletsActions.fetchAllWallets, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(WalletsActions.fetchAllWalletsSuccess, (state, action) => ({
    ...state,
    wallets: action.wallets,
    isLoading: false,
  })),
  on(WalletsActions.fetchAllWalletsFailure, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(WalletsActions.initiateCheckoutSuccess, (state, { checkoutUrl, sessionId }) => ({
    ...state,
    checkoutUrl,
    sessionId,
    isLoading: false,
    error: null,
  })),
  on(WalletsActions.initiateCheckoutFailure, (state, { error }) => ({
    ...state,
    checkoutUrl: null,
    sessionId: null,
    isLoading: false,
    error,
  })),
  on(WalletsActions.initiateCheckoutSuccess, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  // on(WalletsActions.handleCheckoutSuccessResult, (state, { message }) => ({
  //   ...state,
  //   message,
  //   isLoading: false,
  //   error: null,
  // })),
  on(WalletsActions.handleCheckoutFailure, (state, { error }) => ({
    ...state,
    message: null,
    isLoading: false,
    error,
  }))
);

export function walletReducer(state: WalletsState | undefined, action: Action) {
  return featureReducer(state, action);
}
