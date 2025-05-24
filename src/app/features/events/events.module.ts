import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ListEventComponent } from './component/list-event/list-event.component';
import { EventDetailsComponent } from './component/event-details/event-details.component';
import { AddEventComponent } from './component/add-event/add-event.component';
import { EditEventComponent } from './component/edit-event/edit-event.component';
import { EventService } from './service/event.service';

const routes: Routes = [
  { path: 'events', component: ListEventComponent },
  { path: 'events/add', component: AddEventComponent },
  { path: 'events/details/:id', component: EventDetailsComponent },
  { path: 'events/edit/:id', component: EditEventComponent }
];

@NgModule({
  declarations: [
    ListEventComponent,
    EventDetailsComponent,
    AddEventComponent,
    EditEventComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    EventService
  ],
  exports: [
    ListEventComponent,
    EventDetailsComponent,
    AddEventComponent,
    EditEventComponent
  ]
})
export class EventsModule { }
