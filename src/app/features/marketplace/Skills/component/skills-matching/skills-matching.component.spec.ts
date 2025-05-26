import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsMatchingComponent } from './skills-matching.component';

describe('SkillsMatchingComponent', () => {
  let component: SkillsMatchingComponent;
  let fixture: ComponentFixture<SkillsMatchingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SkillsMatchingComponent]
    });
    fixture = TestBed.createComponent(SkillsMatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
