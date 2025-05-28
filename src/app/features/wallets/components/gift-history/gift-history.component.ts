import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IGiftTransaction } from '../../models/wallets.model';
import { WalletsService } from '../../services/wallets.service';

@Component({
  selector: 'app-gift-history',
  templateUrl: './gift-history.component.html',
  styleUrls: ['./gift-history.component.css']
})
export class GiftHistoryComponent implements OnInit, OnDestroy {
  sentGifts: IGiftTransaction[] = [];
  receivedGifts: IGiftTransaction[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  
  // Tab management
  activeTab: 'sent' | 'received' = 'sent';
  
  // Filter and sort
  statusFilter: string = 'all';
  sortBy: 'date' | 'amount' = 'date';
  sortOrder: 'asc' | 'desc' = 'desc';
  
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private walletsService: WalletsService
  ) {}

  ngOnInit(): void {
    this.loadGiftHistory();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadGiftHistory(): void {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (!user?._id) {
      this.errorMessage = 'User not found. Please log in again.';
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = null;
    
    // Load both sent and received gifts
    const sentSub = this.walletsService.getSentGifts(user._id).subscribe({
      next: (gifts) => {
        this.sentGifts = gifts || [];
        this.checkLoadingComplete();
      },
      error: (error) => {
        console.error('Error loading sent gifts:', error);
        this.sentGifts = [];
        this.checkLoadingComplete();
      }
    });
    
    const receivedSub = this.walletsService.getReceivedGifts(user._id).subscribe({
      next: (gifts) => {
        this.receivedGifts = gifts || [];
        this.checkLoadingComplete();
      },
      error: (error) => {
        console.error('Error loading received gifts:', error);
        this.receivedGifts = [];
        this.checkLoadingComplete();
      }
    });
    
    this.subscriptions.push(sentSub, receivedSub);
  }

  private checkLoadingComplete(): void {
    // Simple check - in a real app you might want more sophisticated loading state management
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  setActiveTab(tab: 'sent' | 'received'): void {
    this.activeTab = tab;
  }

  getFilteredAndSortedGifts(): IGiftTransaction[] {
    let gifts = this.activeTab === 'sent' ? this.sentGifts : this.receivedGifts;
    
    // Apply status filter
    if (this.statusFilter !== 'all') {
      gifts = gifts.filter(gift => gift.status === this.statusFilter);
    }
    
    // Apply sorting
    gifts = [...gifts].sort((a, b) => {
      let comparison = 0;
      
      if (this.sortBy === 'date') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (this.sortBy === 'amount') {
        comparison = a.amount - b.amount;
      }
      
      return this.sortOrder === 'desc' ? -comparison : comparison;
    });
    
    return gifts;
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

  formatCurrency(amount: number): string {
    return amount.toLocaleString('en-US');
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'completed':
        return '✅';
      case 'pending':
        return '⏳';
      case 'failed':
        return '❌';
      case 'cancelled':
        return '🚫';
      default:
        return '❓';
    }
  }

  getReasonEmoji(reason?: string): string {
    switch (reason) {
      case 'birthday':
        return '🎂';
      case 'congratulations':
        return '🎉';
      case 'thank_you':
        return '🙏';
      case 'just_because':
        return '💝';
      case 'other':
        return '✨';
      default:
        return '🎁';
    }
  }

  getReasonLabel(reason?: string): string {
    switch (reason) {
      case 'birthday':
        return 'Birthday';
      case 'congratulations':
        return 'Congratulations';
      case 'thank_you':
        return 'Thank You';
      case 'just_because':
        return 'Just Because';
      case 'other':
        return 'Other';
      default:
        return 'Gift';
    }
  }

  getUserInitial(name: string): string {
    return (name || 'U').charAt(0).toUpperCase();
  }

  cancelGift(giftId: string): void {
    if (confirm('Are you sure you want to cancel this gift?')) {
      this.walletsService.cancelGift(giftId).subscribe({
        next: (response) => {
          if (response.success) {
            // Refresh the gift history
            this.loadGiftHistory();
          } else {
            alert('Failed to cancel gift: ' + response.message);
          }
        },
        error: (error) => {
          console.error('Error cancelling gift:', error);
          alert('Failed to cancel gift. Please try again.');
        }
      });
    }
  }

  canCancelGift(gift: IGiftTransaction): boolean {
    // Can only cancel pending gifts that were sent within the last hour
    if (gift.status !== 'pending') return false;
    
    const giftTime = new Date(gift.createdAt).getTime();
    const now = new Date().getTime();
    const hourInMs = 60 * 60 * 1000;
    
    return (now - giftTime) < hourInMs;
  }

  sendNewGift(): void {
    this.router.navigate(['/wallets/send-gift']);
  }

  goBackToWallet(): void {
    this.router.navigate(['/wallets/wallet-dashboard']);
  }

  refreshHistory(): void {
    this.loadGiftHistory();
  }

  exportHistory(): void {
    const gifts = this.getFilteredAndSortedGifts();
    const csvContent = this.generateCSV(gifts);
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartskillz-gift-history-${this.activeTab}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private generateCSV(gifts: IGiftTransaction[]): string {
    const headers = ['Date', 'Amount', 'Recipient/Sender', 'Reason', 'Status', 'Message'];
    const rows = gifts.map(gift => [
      this.formatDate(gift.createdAt),
      gift.amount.toString(),
      this.activeTab === 'sent' ? gift.recipientName : gift.senderName,
      this.getReasonLabel(gift.reason),
      gift.status,
      gift.message || ''
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  getTotalAmount(): number {
    const gifts = this.getFilteredAndSortedGifts();
    return gifts.reduce((sum, gift) => sum + gift.amount, 0);
  }

  getCompletedCount(): number {
    const gifts = this.getFilteredAndSortedGifts();
    return gifts.filter(gift => gift.status === 'completed').length;
  }
}
