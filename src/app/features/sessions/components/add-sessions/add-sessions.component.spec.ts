import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSessionsComponent } from './add-sessions.component';

describe('AddSessionsComponent', () => {
  let component: AddSessionsComponent;
  let fixture: ComponentFixture<AddSessionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSessionsComponent]
    });
    fixture = TestBed.createComponent(AddSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
