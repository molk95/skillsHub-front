import { createReducer, on } from "@ngrx/store";
import * as WalletsActions from './wallets.actions';
import { IWallet } from "../models/wallets.model";
import { IRewardsWithConversion, IRewardsHistory } from "../models/rewards.model";

export interface WalletsState {
  wallets: IWallet[];
  selectedWallet: IWallet | null;
  isLoading: boolean;
  checkoutUrl: string | null;
  sessionId: string | null;
  message: string | null;
  error: string | null;
  // Rewards state
  userRewards: IRewardsWithConversion | null;
  rewardsHistory: IRewardsHistory[];
  rewardsLoading: boolean;
  rewardsError: string | null;
}

export const initialState: WalletsState = {
  wallets: [],
  selectedWallet: null,
  isLoading: false,
  checkoutUrl: null,
  sessionId: null,
  message: null,
  error: null,
  // Rewards initial state
  userRewards: null,
  rewardsHistory: [],
  rewardsLoading: false,
  rewardsError: null,
};

export const walletsReducer = createReducer(
  initialState,
  // Fetch all wallets
  on(WalletsActions.fetchAllWallets, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(WalletsActions.fetchAllWalletsSuccess, (state, { wallets }) => ({
    ...state,
    wallets,
    isLoading: false,
    error: null
  })),
  on(WalletsActions.fetchAllWalletsFailure, (state) => ({
    ...state,
    isLoading: false,
    error: 'Failed to fetch wallets'
  })),

  // Fetch wallet by ID
  on(WalletsActions.fetchWalletById, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(WalletsActions.fetchWalletByIdSuccess, (state, { wallet }) => ({
    ...state,
    selectedWallet: wallet,
    isLoading: false,
    error: null
  })),
  on(WalletsActions.fetchWalletByIdFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Loader
  on(WalletsActions.SetWalletLoader, (state, { isLoading }) => ({
    ...state,
    isLoading
  })),

  // Checkout
  on(WalletsActions.initiateCheckout, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(WalletsActions.initiateCheckoutSuccess, (state, { checkoutUrl, sessionId }) => ({
    ...state,
    checkoutUrl,
    sessionId,
    isLoading: false,
    error: null
  })),
  on(WalletsActions.initiateCheckoutFailure, (state, { error }) => ({
    ...state,
    checkoutUrl: null,
    sessionId: null,
    isLoading: false,
    error
  })),

  // Checkout success handling
  on(WalletsActions.handleCheckoutSuccess, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(WalletsActions.handleCheckoutSuccessResult, (state, { message }) => ({
    ...state,
    message,
    isLoading: false,
    error: null
  })),
  on(WalletsActions.handleCheckoutFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Rewards reducers
  on(WalletsActions.fetchUserRewards, (state) => ({
    ...state,
    rewardsLoading: true,
    rewardsError: null
  })),
  on(WalletsActions.fetchUserRewardsSuccess, (state, { rewards }) => ({
    ...state,
    userRewards: rewards,
    rewardsLoading: false,
    rewardsError: null
  })),
  on(WalletsActions.fetchUserRewardsFailure, (state, { error }) => ({
    ...state,
    rewardsLoading: false,
    rewardsError: error
  })),

  on(WalletsActions.fetchRewardsHistory, (state) => ({
    ...state,
    rewardsLoading: true,
    rewardsError: null
  })),
  on(WalletsActions.fetchRewardsHistorySuccess, (state, { history }) => ({
    ...state,
    rewardsHistory: history,
    rewardsLoading: false,
    rewardsError: null
  })),
  on(WalletsActions.fetchRewardsHistoryFailure, (state, { error }) => ({
    ...state,
    rewardsLoading: false,
    rewardsError: error
  })),

  on(WalletsActions.convertPointsToImoney, (state) => ({
    ...state,
    rewardsLoading: true,
    rewardsError: null
  })),
  on(WalletsActions.convertPointsToImoneySuccess, (state, { result }) => ({
    ...state,
    rewardsLoading: false,
    rewardsError: null,
    // Update the selected wallet with new balance
    selectedWallet: state.selectedWallet ? {
      ...state.selectedWallet,
      imoney: result.wallet?.imoney || state.selectedWallet.imoney
    } : null
  })),
  on(WalletsActions.convertPointsToImoneyFailure, (state, { error }) => ({
    ...state,
    rewardsLoading: false,
    rewardsError: error
  }))
);
