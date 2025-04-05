import { createReducer, on, Action } from "@ngrx/store";
import * as WalletsActions from './wallets.actions';
import { IWallet } from "../models/wallets.model";

export interface WalletsState {
  wallets: IWallet[];
  isLoading: boolean;
}

export const initialState: WalletsState = {
  wallets: [],
  isLoading: false,
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
  }))
);

export function walletReducer(state: WalletsState | undefined, action: Action) {
  return featureReducer(state, action);
}
