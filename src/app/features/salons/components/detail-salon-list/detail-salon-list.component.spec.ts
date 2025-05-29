import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSalonListComponent } from './detail-salon-list.component';

describe('DetailSalonListComponent', () => {
  let component: DetailSalonListComponent;
  let fixture: ComponentFixture<DetailSalonListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailSalonListComponent]
    });
    fixture = TestBed.createComponent(DetailSalonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
