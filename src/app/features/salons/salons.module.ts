import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// Composants salons
import { AddSalonsComponent } from './components/add-salons/add-salons.component';
import { ListSalonsComponent } from './components/list-salons/list-salons.component';
import { UpdateSalonsComponent } from './components/update-salons/update-salons.component';
import { DeleteSalonsComponent } from './components/delete-salons/delete-salons.component';
import { SalonsComponent } from './components/salons/salons.component';
import { SalonDocumentsComponent } from './components/salon-documents/salon-documents.component';
import { DetailSalonListComponent } from './components/detail-salon-list/detail-salon-list.component';
import { SalonsSessionsComponent } from './components/salons-sessions/salons-sessions.component';

const routes: Routes = [
  // tes routes salons
];

@NgModule({
  declarations: [
    AddSalonsComponent,
    ListSalonsComponent,
    UpdateSalonsComponent,
    DeleteSalonsComponent,
    SalonsComponent,
    SalonDocumentsComponent,
    DetailSalonListComponent,
    SalonsSessionsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class SalonsModule { }