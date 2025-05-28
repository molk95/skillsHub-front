import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/core/app.state';
import { fetchAllWallets } from '../../store/wallets.actions';
import { IWallet } from '../../models/wallets.model';

@Component({
  selector: 'app-wallets-list',
  templateUrl: './wallets-list.component.html',
  styleUrls: ['./wallets-list.component.css']
})
export class WalletsListComponent implements OnInit {
  wallets$: Observable<IWallet[]> = this.store.select((state) => state.wallets.wallets);
  isLoading$: Observable<boolean> = this.store.select((state) => state.wallets.isLoading);
  userRole: string | null = null;
  isAuthorized = false;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check user role and authorization
    this.checkUserAuthorization();

    if (this.isAuthorized) {
      console.log('ADMIN user - Dispatching fetchAllWallets action...');
      this.store.dispatch(fetchAllWallets());
    } else {
      console.log('Unauthorized access - redirecting...');
      this.redirectUnauthorizedUser();
    }
  }

  private checkUserAuthorization(): void {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    this.userRole = user?.role || null;

    // Only ADMIN users can access the wallets list
    this.isAuthorized = this.userRole === 'ADMIN';
  }

  private redirectUnauthorizedUser(): void {
    // Redirect non-admin users to their own wallet dashboard
    this.router.navigate(['/wallets/wallet-dashboard']);
  }

  viewWalletDetails(walletId: string): void {
    console.log('Viewing wallet details for ID:', walletId);

    if (walletId) {
      // Use relative navigation instead of absolute
      this.router.navigate([walletId], { relativeTo: this.route });
    } else {
      console.error('Wallet ID is undefined or null');
    }
  }

  viewAdminWalletDetails(walletId: string): void {
    console.log('Viewing admin wallet details for ID:', walletId);

    if (walletId) {
      // Navigate to admin wallet details component (we'll create this)
      this.router.navigate(['/wallets/admin-details', walletId]);
    } else {
      console.error('Wallet ID is undefined or null');
    }
  }

  formatDate(dateInput: string | Date): string {
    if (!dateInput) return 'Unknown';

    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }
}
