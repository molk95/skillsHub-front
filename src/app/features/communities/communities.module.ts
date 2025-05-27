import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommunitiesListComponent } from './components/communities-list/communities-list.component';
import { CommunityDetailsComponent } from './components/community-details/community-details.component';
import { CommunityFormComponent } from './components/community-form/community-form.component';
import { CommunitiesRoutingModule } from './communities-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    CommunitiesListComponent,
    CommunityDetailsComponent,
    CommunityFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommunitiesRoutingModule,
    SharedModule
  ],
  providers: [DatePipe],
  exports: [
    CommunitiesListComponent,
    CommunityDetailsComponent,
    CommunityFormComponent
  ]
})
export class CommunitiesModule { }



