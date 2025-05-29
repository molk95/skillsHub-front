import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppState } from 'src/app/core/app.state';
import { IWallet } from '../../models/wallets.model';
import { IRewardsHistory, IRewardsWithConversion } from '../../models/rewards.model';
import * as WalletActions from '../../store/wallets.actions';
import { WalletsService } from '../../services/wallets.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-wallet-details',
  templateUrl: './wallet-details.component.html',
  styleUrls: ['./wallet-details.component.css']
})
export class WalletDetailsComponent implements OnInit, OnDestroy {
  wallet$: Observable<IWallet | null>;
  isLoading$: Observable<boolean>;
  private routeSubscription: Subscription | null = null;
  userRole: string | null = null;

  // Rewards observables
  rewardsHistory$: Observable<IRewardsHistory[]>;
  rewardsLoading$: Observable<boolean>;
  userRewards$: Observable<IRewardsWithConversion | null>;

  // Contact Admin Modal Properties
  showContactAdminModal = false;
  contactAdminForm: FormGroup;
  contactRequestSent = false;
  contactRequestError: string | null = null;
  isSubmittingRequest = false;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private walletsService: WalletsService,
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {
    this.wallet$ = this.store.select(state => state.wallets.selectedWallet);
    this.isLoading$ = this.store.select(state => state.wallets.isLoading);

    // Initialize rewards observables
    this.rewardsHistory$ = this.store.select(state => state.wallets.rewardsHistory);
    this.rewardsLoading$ = this.store.select(state => state.wallets.rewardsLoading);
    this.userRewards$ = this.store.select(state => state.wallets.userRewards);

    // Initialize contact admin form
    this.contactAdminForm = this.formBuilder.group({
      reason: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],
      priority: ['medium', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Get user role
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    this.userRole = user?.role || null;

    // Initial load from route params
    this.loadWalletFromRouteParams();

    // Subscribe to route parameter changes to handle navigation between different wallet details
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const walletId = params.get('id');
      if (walletId) {
        this.fetchWalletData(walletId);
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private loadWalletFromRouteParams(): void {
    const walletId = this.route.snapshot.paramMap.get('id');
    if (walletId) {
      this.fetchWalletData(walletId);
    } else {
      console.error('No wallet ID found in route parameters');
    }
  }

  private fetchWalletData(walletId: string): void {
    console.log('Fetching wallet with ID:', walletId);
    this.store.dispatch(WalletActions.fetchWalletById({ id: walletId }));

    // Also load rewards data if we have a user ID
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?.id || user?._id || null;

    if (userId) {
      this.store.dispatch(WalletActions.fetchUserRewards({ userId }));
      this.store.dispatch(WalletActions.fetchRewardsHistory({ userId }));
    }
  }



  goBackToWallets(): void {
    this.router.navigate(['/wallets']);
  }
goBackToMyWallet(): void {
  this.router.navigate(['/wallets/wallet-dashboard']);
}

navigateToRewards(): void {
  this.router.navigate(['/wallets/rewards']);
}

  handleTopUpClick(wallet: IWallet): void {
    if (!wallet.isActive) {
      console.log('Wallet is inactive - please contact support');
      return;
    }

    this.router.navigate(['/wallets/packages']);
  }

  // Activity display methods (same as wallet dashboard)
  getActivityIcon(source: string): string {
    switch (source) {
      case 'wallet_topup':
        return '💰';
      case 'skill_purchase':
        return '🎯';
      case 'challenge_purchase':
        return '🏆';
      case 'points_to_imoney':
        return '🔄';
      default:
        return '⭐';
    }
  }

  getActivityLabel(source: string): string {
    switch (source) {
      case 'wallet_topup':
        return 'Wallet Top-up';
      case 'skill_purchase':
        return 'Skill Purchase';
      case 'challenge_purchase':
        return 'Challenge Purchase';
      case 'points_to_imoney':
        return 'Points Conversion';
      default:
        return 'Manual Points';
    }
  }

  formatActivityDate(dateString: string): string {
    const date = new Date(dateString);
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
        month: 'short',
        day: 'numeric'
      });
    }
  }

  // Client-focused methods
  exportTransactions(): void {
    // TODO: Implement transaction export functionality for client
    console.log('Exporting my transaction history...');
    // This could generate a CSV or PDF of the user's own transaction history
  }

  // Contact Admin Modal Methods
  openContactAdminModal(): void {
    this.showContactAdminModal = true;
    this.contactRequestSent = false;
    this.contactRequestError = null;
    this.contactAdminForm.reset({
      reason: '',
      message: '',
      priority: 'medium'
    });
  }

  closeContactAdminModal(): void {
    this.showContactAdminModal = false;
    this.contactRequestSent = false;
    this.contactRequestError = null;
    this.isSubmittingRequest = false;
  }

  getUserName(): string {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.fullName || user.name || 'User';
    }
    return 'User';
  }

  getUserEmail(): string {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.email || '';
    }
    return '';
  }

  submitContactRequest(): void {
    if (this.contactAdminForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactAdminForm.controls).forEach(key => {
        this.contactAdminForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmittingRequest = true;
    this.contactRequestError = null;

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const requestData: any = {
      userId: user?.id || user?._id,
      userName: this.getUserName(),
      userEmail: this.getUserEmail(),
      reason: this.contactAdminForm.get('reason')?.value,
      message: this.contactAdminForm.get('message')?.value,
      priority: this.contactAdminForm.get('priority')?.value,
      walletId: null, // Will be set from current wallet
      requestType: 'wallet_activation',
      timestamp: new Date().toISOString()
    };

    // Get current wallet ID from the observable
    this.wallet$.subscribe(wallet => {
      if (wallet) {
        requestData.walletId = wallet._id;

        // Send the request to backend
        this.http.post(`${environment.BASE_URL_API}contact/wallet-activation-request`, requestData)
          .subscribe({
            next: (response: any) => {
              console.log('Wallet activation request sent successfully:', response);
              this.isSubmittingRequest = false;
              this.contactRequestSent = true;

              // Reset form
              this.contactAdminForm.reset({
                reason: '',
                message: '',
                priority: 'medium'
              });
            },
            error: (error) => {
              console.error('Error sending wallet activation request:', error);
              this.isSubmittingRequest = false;
              this.contactRequestError = error.error?.message || 'Failed to send activation request. Please try again or contact support directly.';
            }
          });
      } else {
        this.isSubmittingRequest = false;
        this.contactRequestError = 'Unable to identify wallet. Please refresh the page and try again.';
      }
    }).unsubscribe(); // Unsubscribe immediately after getting the value
  }
}
