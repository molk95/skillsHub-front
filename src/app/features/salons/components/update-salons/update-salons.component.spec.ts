import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSalonsComponent } from './update-salons.component';

describe('UpdateSalonsComponent', () => {
  let component: UpdateSalonsComponent;
  let fixture: ComponentFixture<UpdateSalonsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateSalonsComponent]
    });
    fixture = TestBed.createComponent(UpdateSalonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
