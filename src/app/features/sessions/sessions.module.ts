import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { SessionsComponent } from './components/sessions/sessions.component';
import { AddSessionsComponent } from './components/add-sessions/add-sessions.component';
import { SessionListComponent } from './components/list-sessions/list-sessions.component';
import { UpdateSessionComponent } from './components/update-sessions/update-sessions.component';
import { DeleteSessionsComponent } from './components/delete-sessions/delete-sessions.component';

const routes: Routes = [
  { path: '', component: SessionListComponent },
  { path: 'list', component: SessionListComponent },
  { path: 'add/:salonNom', component: AddSessionsComponent },
  { path: 'update/:id', component: UpdateSessionComponent },
  { path: 'delete/:id', component: DeleteSessionsComponent }
];

@NgModule({
  declarations: [
    SessionsComponent,
    AddSessionsComponent,
    SessionListComponent,
    UpdateSessionComponent,
    DeleteSessionsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class SessionsModule { }
