import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { IWallet } from '../models/wallets.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WalletsService {

  constructor(private http: HttpClient) { }

  public listWallets(): Observable<IWallet[]> {
    return this.http.get<IWallet[]>(`${environment.BASE_URL_API}wallets`);
  }
  
  public getWalletById(id: string): Observable<IWallet> {
    return this.http.get<IWallet>(`${environment.BASE_URL_API}wallets/${id}`);
  }
  
  public createWallet(walletData: any): Observable<IWallet> {
    return this.http.post<IWallet>(`${environment.BASE_URL_API}wallets`, walletData);
  }
  
  public deactivateWallet(walletId: string): Observable<any> {
    return this.http.patch(`${environment.BASE_URL_API}wallets/${walletId}/deactivate`, {});
  }
  
  public activateWallet(walletId: string): Observable<any> {
    return this.http.patch(`${environment.BASE_URL_API}wallets/${walletId}/activate`, {});
  }
  
  createCheckoutSession(userId: string, amount: number, imoneyValue: number): Observable<any> {
    return this.http.post(`${environment.BASE_URL_API}wallets/top-up/create-session`, {
      userId,
      amount,
      imoneyValue,
    });
  }

  handleCheckoutSuccess(sessionId: string): Observable<any> {
    return this.http.get(`${environment.BASE_URL_API}wallets/top-up/success`, {
      params: { session_id: sessionId },
    });
  }
}
