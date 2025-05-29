import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalonDocumentsComponent } from './salon-documents.component';

describe('SalonDocumentsComponent', () => {
  let component: SalonDocumentsComponent;
  let fixture: ComponentFixture<SalonDocumentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalonDocumentsComponent]
    });
    fixture = TestBed.createComponent(SalonDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
