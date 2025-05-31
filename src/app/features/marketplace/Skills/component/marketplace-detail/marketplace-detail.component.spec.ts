import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceDetailComponent } from './marketplace-detail.component';

describe('MarketplaceDetailComponent', () => {
  let component: MarketplaceDetailComponent;
  let fixture: ComponentFixture<MarketplaceDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarketplaceDetailComponent]
    });
    fixture = TestBed.createComponent(MarketplaceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
