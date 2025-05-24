import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommunitiesListComponent } from './components/communities-list/communities-list.component';
import { CommunityDetailsComponent } from './components/community-details/community-details.component';
import { CommunityFormComponent } from './components/community-form/community-form.component';

const routes: Routes = [
  { path: '', component: CommunitiesListComponent },
  { path: 'create', component: CommunityFormComponent },
  { path: 'edit/:id', component: CommunityFormComponent },
  { path: ':id', component: CommunityDetailsComponent },
  { path: 'details/:id', component: CommunityDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunitiesRoutingModule { }
