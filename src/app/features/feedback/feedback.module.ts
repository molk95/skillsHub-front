import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedbackRoutingModule } from './feedback-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AverageRatingComponent } from './components/average-rating/average-rating.component';
import { TopRatedUsersComponent } from './components/top-rated-users/top-rated-users.component';

// AJOUTE ICI tes composants de feedback
import { CreateFeedbackComponent } from './components/create/create.component';
import { ListFeedbackComponent } from './components/list/list.component';
import { UpdateFeedbackComponent } from './components/update/update.component';
import { DetailsFeedbackComponent } from './components/details/details.component';
import { DeleteFeedbackComponent } from './components/delete/delete.component';

@NgModule({
  declarations: [
    AverageRatingComponent,
    TopRatedUsersComponent,
    // AJOUTE ICI
    CreateFeedbackComponent,
    ListFeedbackComponent,
    UpdateFeedbackComponent,
    DetailsFeedbackComponent,
    DeleteFeedbackComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FeedbackRoutingModule,
    RouterModule
  ]
})
export class FeedbackModule { }