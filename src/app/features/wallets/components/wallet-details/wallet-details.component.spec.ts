import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletDetailsComponent } from './wallet-details.component';

describe('WalletDetailsComponent', () => {
  let component: WalletDetailsComponent;
  let fixture: ComponentFixture<WalletDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WalletDetailsComponent]
    });
    fixture = TestBed.createComponent(WalletDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
