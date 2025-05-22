import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSessionsComponent } from './delete-sessions.component';

describe('DeleteSessionsComponent', () => {
  let component: DeleteSessionsComponent;
  let fixture: ComponentFixture<DeleteSessionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteSessionsComponent]
    });
    fixture = TestBed.createComponent(DeleteSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
