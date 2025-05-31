import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDashboardLayoutComponent } from './client-dashboard-layout.component';

describe('ClientDashboardLayoutComponent', () => {
  let component: ClientDashboardLayoutComponent;
  let fixture: ComponentFixture<ClientDashboardLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientDashboardLayoutComponent]
    });
    fixture = TestBed.createComponent(ClientDashboardLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
