import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChallengesRoutingModule } from './challenges-routing.module';
import { ChallengeListComponent } from './components/challenge-list/challenge-list.component';
import { ChallengeDetailsComponent } from './components/challenge-details/challenge-details.component';
import { ChallengeFormComponent } from './components/challenge-form/challenge-form.component';
import { ChallengeValidateComponent } from './components/challenge-validate/challenge-validate.component';
import { ChallengeTriviaComponent } from './components/challenge-trivia/challenge-trivia.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ChallengeUpcomingComponent } from './components/challenge-upcoming/challenge-upcoming.component';


@NgModule({
  declarations: [
    ChallengeListComponent,
    ChallengeDetailsComponent,
    ChallengeFormComponent,
    ChallengeValidateComponent,
    ChallengeTriviaComponent,
    ChallengeUpcomingComponent
  ],
  imports: [
    CommonModule,
    ChallengesRoutingModule,
    ReactiveFormsModule,
  ]
})
export class ChallengesModule { }
