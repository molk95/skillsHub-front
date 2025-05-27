import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BadgeListComponent } from './components/badge-list/badge-list.component';
import { BadgeFormComponent } from './components/badge-form/badge-form.component';
import { BadgeDetailComponent } from './components/badge-detail/badge-detail.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';

const routes: Routes = [
  { path: '', component: BadgeListComponent },
      { path: 'create', component: BadgeFormComponent },
      { path: 'user/:userId', component: BadgeDetailComponent }, 
      { path: 'leaderboard', component: LeaderboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BadgesRoutingModule { }
