import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { AdminDashboardLayoutComponent } from './admin-dashboard-layout/admin-dashboard-layout.component';
import { ClientDashboardLayoutComponent } from './client-dashboard-layout/client-dashboard-layout.component';
import { AdminOverviewComponent } from './admin-overview/admin-overview.component';
import { ClientProfileComponent } from './client-profile/client-profile.component';
import { DashboardSettingsComponent } from './dashboard-settings/dashboard-settings.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';

@NgModule({
  declarations: [
    DashboardPageComponent,
    AdminDashboardLayoutComponent,
    ClientDashboardLayoutComponent,
    AdminOverviewComponent,
    ClientProfileComponent,
    DashboardSettingsComponent,
    ManageUsersComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    DashboardRoutingModule,
  ],
})
export class DashboardModule {}
