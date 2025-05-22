import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeUpcomingComponent } from './challenge-upcoming.component';

describe('ChallengeUpcomingComponent', () => {
  let component: ChallengeUpcomingComponent;
  let fixture: ComponentFixture<ChallengeUpcomingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChallengeUpcomingComponent]
    });
    fixture = TestBed.createComponent(ChallengeUpcomingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
