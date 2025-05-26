import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFeedbackComponent } from './create.component';

describe('CreateFeedbackComponent', () => {
  let component: CreateFeedbackComponent;
  let fixture: ComponentFixture<CreateFeedbackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateFeedbackComponent]
    });
    fixture = TestBed.createComponent(CreateFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
