import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteFeedbackComponent } from './delete.component';

describe('DeleteFeedbackComponent', () => {
  let component: DeleteFeedbackComponent;
  let fixture: ComponentFixture<DeleteFeedbackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteFeedbackComponent]
    });
    fixture = TestBed.createComponent(DeleteFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
