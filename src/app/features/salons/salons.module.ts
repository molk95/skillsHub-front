import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { SalonsComponent } from './components/salons/salons.component';
import { AddSalonsComponent } from './components/add-salons/add-salons.component';
import { ListSalonsComponent } from './components/list-salons/list-salons.component';
import { UpdateSalonsComponent } from './components/update-salons/update-salons.component';
import { DeleteSalonsComponent } from './components/delete-salons/delete-salons.component';
import { SalonsSessionsComponent } from './components/salons-sessions/salons-sessions.component';

const routes: Routes = [
  { path: '', component: ListSalonsComponent },
  { path: 'list', component: ListSalonsComponent },
  { path: 'add', component: AddSalonsComponent },
  { path: 'update/:nom', component: UpdateSalonsComponent },
  { path: 'delete', component: DeleteSalonsComponent },
  { path: 'sessions', component: SalonsSessionsComponent }
];

@NgModule({
  declarations: [
    SalonsComponent,
    AddSalonsComponent,
    ListSalonsComponent,
    UpdateSalonsComponent,
    DeleteSalonsComponent,
    SalonsSessionsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class SalonsModule { }
