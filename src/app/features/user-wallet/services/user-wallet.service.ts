import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ITransaction } from '../models/transaction.model';
import { IWallet } from '../../wallets/models/wallets.model';

@Injectable({
  providedIn: 'root'
})
export class UserWalletService {

  constructor(private http: HttpClient) { }

  getUserWallet(userId: string): Observable<IWallet> {
    return this.http.get<IWallet>(`${environment.BASE_URL_API}wallets/user/${userId}`);
  }

  getTransactionHistory(userId: string): Observable<ITransaction[]> {
    return this.http.get<ITransaction[]>(`${environment.BASE_URL_API}wallets/transactions/${userId}`);
  }

  createWallet(walletData: any): Observable<IWallet> {
    return this.http.post<IWallet>(`${environment.BASE_URL_API}wallets`, walletData);
  }

  activateWallet(walletId: string): Observable<any> {
    return this.http.patch(`${environment.BASE_URL_API}wallets/${walletId}/activate`, {});
  }

  deactivateWallet(walletId: string): Observable<any> {
    return this.http.patch(`${environment.BASE_URL_API}wallets/${walletId}/deactivate`, {});
  }
}