import { Component } from '@angular/core';
import { IWallet } from '../../models/wallets.model';

@Component({
  selector: 'app-wallet-details',
  templateUrl: './wallet-details.component.html',
  styleUrls: ['./wallet-details.component.css']
})
export class WalletDetailsComponent {
wallet!: IWallet
walletId: string = ''

constructor() {}
}
