import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/app.state';
import { UserWalletService } from '../../services/user-wallet.service';
import { ITransaction } from '../../models/transaction.model';
import * as UserWalletActions from '../../store/user-wallet.actions';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent implements OnInit {
  transactions: ITransaction[] = [];
  isLoading = false;
  error: string | null = null;
  userId: string | null = null;
  
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private walletsService: UserWalletService
  ) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    
    if (this.userId) {
      this.loadTransactions();
    }
  }

  loadTransactions(): void {
    this.isLoading = true;
    
    this.walletsService.getTransactionHistory(this.userId!).subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load transaction history';
        this.isLoading = false;
        console.error('Error loading transactions:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/user-wallet']);
  }
}
