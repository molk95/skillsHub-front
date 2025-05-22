import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeTriviaComponent } from './challenge-trivia.component';

describe('ChallengeTriviaComponent', () => {
  let component: ChallengeTriviaComponent;
  let fixture: ComponentFixture<ChallengeTriviaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChallengeTriviaComponent]
    });
    fixture = TestBed.createComponent(ChallengeTriviaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
