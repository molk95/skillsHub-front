import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/core/app.state';
import { IWallet } from '../../models/wallets.model';
import * as WalletActions from '../../store/wallets.actions';

interface Package {
  id: number;
  name: string;
  amount: number;
  imoneyValue: number;
  description: string;
  isPopular?: boolean;
  points: number; // Custom points for each package
}

@Component({
  selector: 'app-package-selection',
  templateUrl: './package-selection.component.html',
  styleUrls: ['./package-selection.component.css']
})
export class PackageSelectionComponent implements OnInit {
  packages: Package[] = [
    {
      id: 1,
      name: 'Basic',
      amount: 10,
      imoneyValue: 10,
      description: 'Perfect for small tasks and quick rewards',
      points: 15 // 15 points for Basic package
    },
    {
      id: 2,
      name: 'Standard',
      amount: 25,
      imoneyValue: 30, // 20% bonus
      description: 'Most popular choice with 20% bonus iMoney',
      isPopular: true,
      points: 50 // 50 points for Standard package (better rate!)
    },
    {
      id: 3,
      name: 'Premium',
      amount: 50,
      imoneyValue: 65, // 30% bonus
      description: 'Best value with 30% bonus iMoney',
      points: 120 // 120 points for Premium package (best rate!)
    }
  ];

  selectedPackage: Package | null = null;
  wallet$: Observable<IWallet | null>;
  error: string | null = null;

  constructor(
    private router: Router,
    private store: Store<AppState>
  ) {
    this.wallet$ = this.store.select(state => state.wallets.selectedWallet);
  }

  ngOnInit(): void {
    // Check if wallet is active
    this.wallet$.subscribe(wallet => {
      if (wallet && !wallet.isActive) {
        this.error = 'Cannot top up a deactivated wallet. Please activate the wallet first.';
        setTimeout(() => {
          this.router.navigate(['/wallets']);
        }, 3000);
      }
    });
  }

  selectPackage(pkg: Package): void {
    this.selectedPackage = pkg;
  }

  proceedToTopUp(): void {
    if (this.selectedPackage) {
      // Store selected package in localStorage to retrieve in top-up component
      localStorage.setItem('selectedPackage', JSON.stringify(this.selectedPackage));
      this.router.navigate(['/wallets/top-up']);
    }
  }

  goBackToWallets(): void {
    this.router.navigate(['/wallets']);
  }
}
