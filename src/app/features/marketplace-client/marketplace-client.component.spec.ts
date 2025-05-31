import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceClientComponent } from './marketplace-client.component';

describe('MarketplaceClientComponent', () => {
  let component: MarketplaceClientComponent;
  let fixture: ComponentFixture<MarketplaceClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarketplaceClientComponent]
    });
    fixture = TestBed.createComponent(MarketplaceClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
