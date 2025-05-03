import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Package {
  id: number;
  name: string;
  amount: number;
  imoneyValue: number;
  description: string;
  isPopular?: boolean;
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
      description: 'Perfect for small tasks and quick rewards'
    },
    {
      id: 2,
      name: 'Standard',
      amount: 25,
      imoneyValue: 30, // 20% bonus
      description: 'Most popular choice with 20% bonus iMoney',
      isPopular: true
    },
    {
      id: 3,
      name: 'Premium',
      amount: 50,
      imoneyValue: 65, // 30% bonus
      description: 'Best value with 30% bonus iMoney'
    }
  ];

  selectedPackage: Package | null = null;

  constructor(private router: Router) { }

  ngOnInit(): void {
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