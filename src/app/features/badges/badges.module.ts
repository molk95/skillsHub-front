import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BadgesRoutingModule } from './badges-routing.module';
import { BadgeListComponent } from './components/badge-list/badge-list.component';
import { BadgeFormComponent } from './components/badge-form/badge-form.component';
import { BadgeDetailComponent } from './components/badge-detail/badge-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { CertificateComponent } from './components/certificate/certificate.component';


@NgModule({
  declarations: [
    BadgeListComponent,
    BadgeFormComponent,
    BadgeDetailComponent,
    LeaderboardComponent,
    CertificateComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    BadgesRoutingModule,
    ReactiveFormsModule,
  ]
})
export class BadgesModule { }
