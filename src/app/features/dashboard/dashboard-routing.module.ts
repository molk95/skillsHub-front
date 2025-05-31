import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardLayoutComponent } from './admin-dashboard-layout/admin-dashboard-layout.component';
import { ClientDashboardLayoutComponent } from './client-dashboard-layout/client-dashboard-layout.component';
import { AdminOverviewComponent } from './admin-overview/admin-overview.component';
import { ClientProfileComponent } from './client-profile/client-profile.component';
import { DashboardSettingsComponent } from './dashboard-settings/dashboard-settings.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminDashboardLayoutComponent,
    children: [
      { path: '', component: AdminOverviewComponent },
      { path: 'overview', component: AdminOverviewComponent },
      { path: 'users', component: AdminOverviewComponent }, // For now, can be separate component later
      { path: 'settings', component: DashboardSettingsComponent },
    ],
  },
  {
    path: 'client',
    component: ClientDashboardLayoutComponent,
    children: [
      { path: '', component: ClientProfileComponent },
      { path: 'profile', component: ClientProfileComponent },
      { path: 'orders', component: ClientProfileComponent }, // For now, can be separate component later
      { path: 'settings', component: DashboardSettingsComponent },
    ],
  },
  { path: '', redirectTo: 'client', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
