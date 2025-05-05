import { createReducer, on } from "@ngrx/store";
import * as forumsActions from './forums.actions';
import { Forum} from "../models/forums.model";

export interface forumsState {
  forums: Forum[];
  selectedforum: Forum | null;
  isLoading: boolean;
  checkoutUrl: string | null;
  sessionId: string | null;
  message: string | null;
  error: string | null;
}

export const initialState: forumsState = {
  forums: [],
  selectedforum: null,
  isLoading: false,
  checkoutUrl: null,
  sessionId: null,
  message: null,
  error: null,
};

export const forumsReducer = createReducer(
  initialState,
  // Fetch all forums
  on(forumsActions.fetchAllforums, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(forumsActions.fetchAllforumsSuccess, (state, { forums }) => ({
    ...state,
    forums,
    isLoading: false,
    error: null
  })),
  on(forumsActions.fetchAllforumsFailure, (state) => ({
    ...state,
    isLoading: false,
    error: 'Failed to fetch forums'
  })),
  
  // Fetch forum by ID
  on(forumsActions.fetchforumById, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(forumsActions.fetchforumByIdSuccess, (state, { forum }) => ({
    ...state,
    selectedforum: forum,
    isLoading: false,
    error: null
  })),
  on(forumsActions.fetchforumByIdFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  
  // Loader
  on(forumsActions.SetforumLoader, (state, { isLoading }) => ({
    ...state,
    isLoading
  })),
  
  // Checkout
  on(forumsActions.initiateCheckout, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(forumsActions.initiateCheckoutSuccess, (state, { checkoutUrl, sessionId }) => ({
    ...state,
    checkoutUrl,
    sessionId,
    isLoading: false,
    error: null
  })),
  on(forumsActions.initiateCheckoutFailure, (state, { error }) => ({
    ...state,
    checkoutUrl: null,
    sessionId: null,
    isLoading: false,
    error
  })),
  
  // Checkout success handling
  on(forumsActions.handleCheckoutSuccess, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(forumsActions.handleCheckoutSuccessResult, (state, { message }) => ({
    ...state,
    message,
    isLoading: false,
    error: null
  })),
  on(forumsActions.handleCheckoutFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  }))
);
