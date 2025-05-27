import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { AddForumComponent } from './component/add-forum/add-forum.component';
import { ForumsListComponent } from './component/list-forum/list-forum.component';
import { EditForumComponent } from './component/edit-forum/edit-forum.component';
import { ForumDetailsComponent } from './component/forum-details/forum-details.component';

const routes: Routes = [
  { path: '', component: ForumsListComponent },
  { path: 'list', component: ForumsListComponent },
  { path: 'add', component: AddForumComponent },
  { path: 'edit/:id', component: EditForumComponent },
  { path: 'details/:id', component: ForumDetailsComponent }
];

@NgModule({
  declarations: [
    AddForumComponent,
    ForumsListComponent,
    EditForumComponent,
    ForumDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  providers: [DatePipe]
})
export class ForumsModule { }
