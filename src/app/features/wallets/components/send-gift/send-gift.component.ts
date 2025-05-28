import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { IWallet, IGiftRequest, IGiftResponse } from '../../models/wallets.model';
import { WalletsService } from '../../services/wallets.service';

interface UserSearchResult {
  _id: string;
  fullName: string;
  email: string;
}

@Component({
  selector: 'app-send-gift',
  templateUrl: './send-gift.component.html',
  styleUrls: ['./send-gift.component.css']
})
export class SendGiftComponent implements OnInit, OnDestroy {
  giftForm: FormGroup;
  wallet$: Observable<IWallet | null>;
  isLoading = false;
  isSending = false;

  // User search
  searchResults: UserSearchResult[] = [];
  isSearching = false;
  selectedRecipient: UserSearchResult | null = null;

  // Form state
  successMessage: string | null = null;
  errorMessage: string | null = null;
  currentUserBalance = 0;

  // Gift reasons
  giftReasons = [
    { value: 'birthday', label: '🎂 Birthday', emoji: '🎂' },
    { value: 'congratulations', label: '🎉 Congratulations', emoji: '🎉' },
    { value: 'thank_you', label: '🙏 Thank You', emoji: '🙏' },
    { value: 'just_because', label: '💝 Just Because', emoji: '💝' },
    { value: 'other', label: '✨ Other', emoji: '✨' }
  ];

  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private walletsService: WalletsService
  ) {
    // We'll load wallet data directly instead of using store
    this.wallet$ = new Observable<IWallet | null>();

    this.giftForm = this.fb.group({
      recipientEmail: ['', [Validators.required, Validators.email]],
      amount: ['', [Validators.required, Validators.min(1), Validators.max(1000)]],
      message: ['', [Validators.maxLength(200)]],
      reason: ['just_because', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadUserWallet();
    this.setupEmailSearch();
    this.setupFormValidation();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadUserWallet(): void {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?.id || user?._id || null;

    console.log('User data from localStorage:', user);
    console.log('Extracted userId:', userId);

    if (!userId) {
      this.errorMessage = 'User not found. Please log in again.';
      return;
    }

    console.log('Loading wallet for user:', userId);
    this.isLoading = true;

    // Load wallet using the wallet service directly
    this.walletsService.getWalletByUserId(userId).subscribe({
      next: (wallet) => {
        console.log('Wallet loaded:', wallet);
        this.isLoading = false;

        if (wallet) {
          // Get the iMoney value
          const imoneyValue = wallet.imoney?.value || 0;
          this.currentUserBalance = imoneyValue;

          console.log('Current user balance:', this.currentUserBalance);

          // Update amount validator based on current balance
          const maxAmount = Math.min(this.currentUserBalance, 1000);
          this.giftForm.get('amount')?.setValidators([
            Validators.required,
            Validators.min(1),
            Validators.max(maxAmount)
          ]);
          this.giftForm.get('amount')?.updateValueAndValidity();

          // Clear any previous error
          this.errorMessage = null;
        } else {
          this.errorMessage = 'Wallet not found. Please create a wallet first.';
          this.currentUserBalance = 0;
        }
      },
      error: (error) => {
        console.error('Error loading wallet:', error);
        this.isLoading = false;
        this.errorMessage = 'Failed to load wallet information. Please try again.';
        this.currentUserBalance = 0;
      }
    });
  }

  private setupEmailSearch(): void {
    const emailControl = this.giftForm.get('recipientEmail');

    if (emailControl) {
      const searchSub = emailControl.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged()
        )
        .subscribe(email => {
          if (email && email.length > 2 && this.isValidEmail(email)) {
            this.searchUsers(email);
          } else {
            this.searchResults = [];
            this.selectedRecipient = null;
          }
        });

      this.subscriptions.push(searchSub);
    }
  }

  private setupFormValidation(): void {
    // Add custom validator for amount based on balance
    const amountControl = this.giftForm.get('amount');

    if (amountControl) {
      const amountSub = amountControl.valueChanges.subscribe(amount => {
        if (amount > this.currentUserBalance) {
          amountControl.setErrors({ insufficientBalance: true });
        }
      });

      this.subscriptions.push(amountSub);
    }
  }

  private searchUsers(email: string): void {
    this.isSearching = true;

    this.walletsService.searchUsersByEmail(email).subscribe({
      next: (response) => {
        this.searchResults = response.users || [];
        this.isSearching = false;
      },
      error: (error) => {
        console.error('Error searching users:', error);
        this.searchResults = [];
        this.isSearching = false;
      }
    });
  }

  selectRecipient(user: UserSearchResult): void {
    this.selectedRecipient = user;
    this.giftForm.patchValue({ recipientEmail: user.email });
    this.searchResults = [];
  }

  clearRecipient(): void {
    this.selectedRecipient = null;
    this.giftForm.patchValue({ recipientEmail: '' });
    this.searchResults = [];
  }

  onSubmit(): void {
    if (this.giftForm.valid && !this.isSending) {
      this.sendGift();
    }
  }

  private sendGift(): void {
    this.isSending = true;
    this.errorMessage = null;
    this.successMessage = null;

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?.id || user?._id || null;

    console.log('Sending gift - User data:', user);
    console.log('Sending gift - Extracted userId:', userId);

    if (!userId) {
      this.errorMessage = 'User not found. Please log in again.';
      this.isSending = false;
      return;
    }

    const giftRequest: IGiftRequest = {
      recipientEmail: this.giftForm.value.recipientEmail,
      amount: Number(this.giftForm.value.amount),
      message: this.giftForm.value.message || undefined,
      reason: this.giftForm.value.reason
    };

    console.log('Sending gift request:', giftRequest);

    this.walletsService.sendGift(userId, giftRequest).subscribe({
      next: (response: IGiftResponse) => {
        this.isSending = false;

        if (response.success) {
          this.successMessage = response.message;
          this.currentUserBalance = response.senderNewBalance || this.currentUserBalance;

          // Reset form
          this.giftForm.reset({
            recipientEmail: '',
            amount: '',
            message: '',
            reason: 'just_because'
          });
          this.selectedRecipient = null;

          // Refresh wallet data
          this.loadUserWallet();

          // Navigate to success page after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/wallets/gift-success'], {
              queryParams: {
                amount: giftRequest.amount,
                recipient: this.selectedRecipient?.fullName || giftRequest.recipientEmail,
                message: giftRequest.message || ''
              }
            });
          }, 2000);

        } else {
          this.errorMessage = response.message || 'Failed to send gift';
        }
      },
      error: (error) => {
        this.isSending = false;
        this.errorMessage = error.error?.message || 'Failed to send gift. Please try again.';
        console.error('Gift sending error:', error);
      }
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getSelectedReason(): any {
    const reasonValue = this.giftForm.get('reason')?.value;
    return this.giftReasons.find(reason => reason.value === reasonValue);
  }

  goBackToWallet(): void {
    this.router.navigate(['/wallets/wallet-dashboard']);
  }

  // Helper methods for template
  get recipientEmailControl() {
    return this.giftForm.get('recipientEmail');
  }

  get amountControl() {
    return this.giftForm.get('amount');
  }

  get messageControl() {
    return this.giftForm.get('message');
  }

  get reasonControl() {
    return this.giftForm.get('reason');
  }

  formatCurrency(amount: number): string {
    return amount.toLocaleString('en-US');
  }

  // Debug method to help troubleshoot user data issues
  getUserDebugInfo(): string {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      return 'No user data in localStorage';
    }

    try {
      const user = JSON.parse(userStr);
      const userId = user?.id || user?._id || null;
      return `ID: ${userId}, Email: ${user?.email || 'N/A'}, Name: ${user?.fullName || 'N/A'}`;
    } catch (error) {
      return 'Invalid user data in localStorage';
    }
  }
}
