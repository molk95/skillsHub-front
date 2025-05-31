import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { AdminDashboardLayoutComponent } from './admin-dashboard-layout/admin-dashboard-layout.component';
import { ClientDashboardLayoutComponent } from './client-dashboard-layout/client-dashboard-layout.component';
import { AdminOverviewComponent } from './admin-overview/admin-overview.component';
import { ClientProfileComponent } from './client-profile/client-profile.component';
import { DashboardSettingsComponent } from './dashboard-settings/dashboard-settings.component';

@NgModule({
  declarations: [
    DashboardPageComponent,
    AdminDashboardLayoutComponent,
    ClientDashboardLayoutComponent,
    AdminOverviewComponent,
    ClientProfileComponent,
    DashboardSettingsComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, DashboardRoutingModule],
})
export class DashboardModule {}
