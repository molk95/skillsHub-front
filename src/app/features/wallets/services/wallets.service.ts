import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IWallet, IGiftRequest, IGiftResponse, IGiftTransaction } from '../models/wallets.model';
import { IRewardsWithConversion, IRewardsHistory, IPointsConversionResponse } from '../models/rewards.model';

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

  public createCheckoutSession(userId: string, amount: number, imoneyValue: number, packageName: string, points?: number): Observable<any> {
    return this.http.post(`${environment.BASE_URL_API}wallets/top-up/create-session`, {
      userId,
      amount,
      imoneyValue,
      packageName,
      points,
    });
  }

  public handleCheckoutSuccess(sessionId: string): Observable<any> {
    return this.http.get(`${environment.BASE_URL_API}wallets/top-up/success`, {
      params: { session_id: sessionId },
    });
  }

  public getWalletByUserId(userId: string): Observable<IWallet> {
    return this.http.get<IWallet>(`${environment.BASE_URL_API}wallets/user/${userId}`);
  }

  // Reward-related methods
  public getUserRewardsWithConversion(userId: string): Observable<IRewardsWithConversion> {
    return this.http.get<IRewardsWithConversion>(`${environment.BASE_URL_API}rewards/${userId}/with-conversion`);
  }

  public getRewardsHistory(userId: string): Observable<IRewardsHistory[]> {
    return this.http.get<IRewardsHistory[]>(`${environment.BASE_URL_API}rewards/${userId}/history`);
  }

  public convertPointsToImoney(userId: string, points: number): Observable<IPointsConversionResponse> {
    return this.http.post<IPointsConversionResponse>(`${environment.BASE_URL_API}wallets/convert-points-to-imoney`, {
      userId,
      points
    });
  }

  // Gift-related methods
  public sendGift(senderUserId: string, giftRequest: IGiftRequest): Observable<IGiftResponse> {
    return this.http.post<IGiftResponse>(`${environment.BASE_URL_API}wallets/send-gift`, {
      senderUserId,
      ...giftRequest
    });
  }

  public getGiftHistory(userId: string): Observable<IGiftTransaction[]> {
    return this.http.get<IGiftTransaction[]>(`${environment.BASE_URL_API}wallets/gifts/history/${userId}`);
  }

  public getSentGifts(userId: string): Observable<IGiftTransaction[]> {
    return this.http.get<IGiftTransaction[]>(`${environment.BASE_URL_API}wallets/gifts/sent/${userId}`);
  }

  public getReceivedGifts(userId: string): Observable<IGiftTransaction[]> {
    return this.http.get<IGiftTransaction[]>(`${environment.BASE_URL_API}wallets/gifts/received/${userId}`);
  }

  public cancelGift(giftId: string): Observable<IGiftResponse> {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?._id;

    return this.http.patch<IGiftResponse>(`${environment.BASE_URL_API}wallets/gifts/${giftId}/cancel`, {
      userId
    });
  }

  public searchUsersByEmail(email: string): Observable<{users: Array<{_id: string, fullName: string, email: string}>}> {
    return this.http.get<{users: Array<{_id: string, fullName: string, email: string}>}>(`${environment.BASE_URL_API}wallets/users/search`, {
      params: { email }
    });
  }
}
