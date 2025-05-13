import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSalonsComponent } from './add-salons.component';

describe('AddSalonsComponent', () => {
  let component: AddSalonsComponent;
  let fixture: ComponentFixture<AddSalonsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSalonsComponent]
    });
    fixture = TestBed.createComponent(AddSalonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
