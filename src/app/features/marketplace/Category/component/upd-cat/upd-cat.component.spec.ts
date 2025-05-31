import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdCatComponent } from './upd-cat.component';

describe('UpdCatComponent', () => {
  let component: UpdCatComponent;
  let fixture: ComponentFixture<UpdCatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdCatComponent]
    });
    fixture = TestBed.createComponent(UpdCatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
