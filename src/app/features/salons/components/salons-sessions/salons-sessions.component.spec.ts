import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalonsSessionsComponent } from './salons-sessions.component';

describe('SalonsSessionsComponent', () => {
  let component: SalonsSessionsComponent;
  let fixture: ComponentFixture<SalonsSessionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalonsSessionsComponent]
    });
    fixture = TestBed.createComponent(SalonsSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
