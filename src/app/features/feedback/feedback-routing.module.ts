import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateFeedbackComponent } from './components/create/create.component';
import { ListFeedbackComponent } from './components/list/list.component';
import { DetailsFeedbackComponent } from './components/details/details.component';
import { UpdateFeedbackComponent } from './components/update/update.component';
import { DeleteFeedbackComponent } from './components/delete/delete.component';
import { AverageRatingComponent } from './components/average-rating/average-rating.component';
import { TopRatedUsersComponent } from './components/top-rated-users/top-rated-users.component';

const routes: Routes = [
  { path: 'feedbacks/create', component: CreateFeedbackComponent },
  { path: 'feedbacks/list', component: ListFeedbackComponent },
  { path: 'feedbacks/details/:id', component: DetailsFeedbackComponent },
  { path: 'feedbacks/update/:id', component: UpdateFeedbackComponent },
  { path: 'feedbacks/delete/:id', component: DeleteFeedbackComponent },
  { path: 'feedback/average-rating', component: AverageRatingComponent },
  { path: 'feedback/top-rated-users', component: TopRatedUsersComponent },
  { path: '', redirectTo: '/feedback/top-rated-users', pathMatch: 'full' } // Default route
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedbackRoutingModule { }
