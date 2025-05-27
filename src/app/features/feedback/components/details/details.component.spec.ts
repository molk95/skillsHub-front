import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsFeedbackComponent } from './details.component';

describe('DetailsFeedbackComponent', () => {
  let component: DetailsFeedbackComponent;
  let fixture: ComponentFixture<DetailsFeedbackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsFeedbackComponent]
    });
    fixture = TestBed.createComponent(DetailsFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
