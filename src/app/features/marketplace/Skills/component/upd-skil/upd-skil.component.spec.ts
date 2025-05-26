import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdSkilComponent } from './upd-skil.component';

describe('UpdSkilComponent', () => {
  let component: UpdSkilComponent;
  let fixture: ComponentFixture<UpdSkilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdSkilComponent]
    });
    fixture = TestBed.createComponent(UpdSkilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
