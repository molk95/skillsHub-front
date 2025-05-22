import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChallengeListComponent } from './components/challenge-list/challenge-list.component';
import { ChallengeDetailsComponent } from './components/challenge-details/challenge-details.component';
import { ChallengeFormComponent } from './components/challenge-form/challenge-form.component';
import { ChallengeValidateComponent } from './components/challenge-validate/challenge-validate.component';
import { ChallengeTriviaComponent } from './components/challenge-trivia/challenge-trivia.component';
import { ChallengeUpcomingComponent } from './components/challenge-upcoming/challenge-upcoming.component';

const routes: Routes = [
  { path: '', component: ChallengeListComponent },
  { path: 'details/:id', component: ChallengeDetailsComponent },
  { path: 'add', component: ChallengeFormComponent },
  { path: 'edit/:id', component: ChallengeFormComponent },
  { path: 'validate', component: ChallengeValidateComponent },
  { path: 'trivia', component: ChallengeTriviaComponent },
  { path: 'upcoming', component: ChallengeUpcomingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChallengesRoutingModule { }
