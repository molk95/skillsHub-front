import { createAction, props } from "@ngrx/store";
import { Forum } from "../models/forums.model";

export const fetchAllforums = createAction(
    '[forums] Fetch All forums',
)

export const fetchAllforumsSuccess = createAction(
    '[forums] Fetch All forums Success',
    props<{ forums: Forum[] }>()
)

export const fetchAllforumsFailure = createAction(
    '[forums] Fetch All forums Failure'
)

export const fetchforumById = createAction(
    '[forums] Fetch forum By Id',
    props<{ id: string }>()
);

export const fetchforumByIdSuccess = createAction(
    '[forums] Fetch forum By Id Success',
    props<{ forum: Forum }>()
);

export const fetchforumByIdFailure = createAction(
    '[forums] Fetch forum By Id Failure',
    props<{ error: string }>()
);

// loader actions
export const SetforumLoader = createAction(
    '[ Loader ] - ShowLoader',
    props<{ isLoading: boolean }>()
);

export const initiateCheckout = createAction(
'[forum] Initiate Checkout',
props<{ userId: string; amount: number; imoneyValue: number }>()
);

export const initiateCheckoutSuccess = createAction(
'[forum] Initiate Checkout Success',
props<{ checkoutUrl: string; sessionId: string }>()
);

export const initiateCheckoutFailure = createAction(
'[forum] Initiate Checkout Failure',
props<{ error: string }>()
);

export const handleCheckoutSuccess = createAction(
'[forum] Handle Checkout Success',
props<{ sessionId: string }>()
);

export const handleCheckoutSuccessResult = createAction(
'[forum] Handle Checkout Success Result',
props<{ message: string }>()
);

export const handleCheckoutFailure = createAction(
'[forum] Handle Checkout Failure',
props<{ error: string }>()
);
