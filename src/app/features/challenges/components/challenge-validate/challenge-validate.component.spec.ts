import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeValidateComponent } from './challenge-validate.component';

describe('ChallengeValidateComponent', () => {
  let component: ChallengeValidateComponent;
  let fixture: ComponentFixture<ChallengeValidateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChallengeValidateComponent]
    });
    fixture = TestBed.createComponent(ChallengeValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
