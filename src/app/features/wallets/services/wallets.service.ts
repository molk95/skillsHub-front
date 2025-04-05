import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { IWallet } from '../models/wallets.model';

@Injectable({
  providedIn: 'root'
})
export class WalletsService {

  constructor(private http: HttpClient) { }

  public listWallets() {
    return this.http.get<IWallet[]>(`${environment.BASE_URL_API}wallets`);
  }
  
}
