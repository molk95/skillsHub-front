import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-gift-success',
  templateUrl: './gift-success.component.html',
  styleUrls: ['./gift-success.component.css']
})
export class GiftSuccessComponent implements OnInit {
  giftAmount: string = '0';
  recipientName: string = '';
  giftMessage: string = '';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get gift details from query parameters
    this.route.queryParams.subscribe(params => {
      this.giftAmount = params['amount'] || '0';
      this.recipientName = params['recipient'] || 'Unknown';
      this.giftMessage = params['message'] || '';
    });
  }

  goToWallet(): void {
    this.router.navigate(['/wallets/wallet-dashboard']);
  }

  sendAnotherGift(): void {
    this.router.navigate(['/wallets/send-gift']);
  }

  viewGiftHistory(): void {
    this.router.navigate(['/wallets/gift-history']);
  }

  formatCurrency(amount: string): string {
    return Number(amount).toLocaleString('en-US');
  }

  shareGift(): void {
    // Simple share functionality
    if (navigator.share) {
      navigator.share({
        title: 'SmartSkillz Gift Sent!',
        text: `I just sent ${this.giftAmount} iMoney to ${this.recipientName} on SmartSkillz! 🎁`,
        url: window.location.origin
      });
    } else {
      // Fallback: copy to clipboard
      const shareText = `I just sent ${this.giftAmount} iMoney to ${this.recipientName} on SmartSkillz! 🎁 ${window.location.origin}`;
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Share text copied to clipboard!');
      });
    }
  }
}
