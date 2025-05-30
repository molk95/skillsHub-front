import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedbackRoutingModule } from './feedback-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AverageRatingComponent } from './components/average-rating/average-rating.component';
import { TopRatedUsersComponent } from './components/top-rated-users/top-rated-users.component';


@NgModule({
  declarations: [
    AverageRatingComponent,
    TopRatedUsersComponent
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
