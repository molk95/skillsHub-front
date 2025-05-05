import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ForumsService } from '../service/forum.service';
import * as forumsActions from '../store/forums.actions'
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { Forum } from '../models/forums.model';
import { Store } from "@ngrx/store";
import { AppState } from "src/app/core/app.state";

@Injectable()
export class ForumEffects {
   constructor(
           private actions$: Actions,
           public store: Store<AppState>,
           private forumService: ForumsService
       
       ) {}
       fetchForumsEffect$ = createEffect(() =>
           this.actions$.pipe(
           ofType(forumsActions.fetchAllforums),
           tap(() =>
           this.store.dispatch(forumsActions.SetforumLoader({ isLoading: true }))
           ),
           switchMap(() =>
           this.forumService.getAllForums().pipe(
               map((res) => forumsActions.fetchAllforumsSuccess({ forums: res as Forum[] })),
               catchError(() =>
               of(forumsActions.fetchAllforumsFailure()).pipe(
                   tap(() => {
                   this.store.dispatch(forumsActions.SetforumLoader({ isLoading: false }));
                   })
               )
               )
           )
           )
       )
       );
       
       
   }