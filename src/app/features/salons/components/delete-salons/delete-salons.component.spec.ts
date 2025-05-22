import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSalonsComponent } from './delete-salons.component';

describe('DeleteSalonsComponent', () => {
  let component: DeleteSalonsComponent;
  let fixture: ComponentFixture<DeleteSalonsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteSalonsComponent]
    });
    fixture = TestBed.createComponent(DeleteSalonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
