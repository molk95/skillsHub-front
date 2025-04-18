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

  public listWallets() {
    return this.http.get<IWallet[]>(`${environment.BASE_URL_API}wallets`);
  }
  
  createCheckoutSession(userId: string, amount: number, imoneyValue: number): Observable<any> {
    return this.http.post(`${environment.BASE_URL_API}wallets/create-checkout-session`, {
      userId,
      amount,
      imoneyValue,
    });
  }

  handleCheckoutSuccess(sessionId: string): Observable<any> {
    return this.http.get(`${environment.BASE_URL_API}wallets/checkout-success`, {
      params: { session_id: sessionId },
    });
  }
}
