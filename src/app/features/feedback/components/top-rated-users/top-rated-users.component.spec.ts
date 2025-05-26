import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopRatedUsersComponent } from './top-rated-users.component';

describe('TopRatedUsersComponent', () => {
  let component: TopRatedUsersComponent;
  let fixture: ComponentFixture<TopRatedUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopRatedUsersComponent]
    });
    fixture = TestBed.createComponent(TopRatedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
