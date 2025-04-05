import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/core/app.state';
import { fetchAllWallets } from '../../store/wallets.actions';
import { IWallet } from '../../models/wallets.model';

@Component({
  selector: 'app-wallets-list',
  templateUrl: './wallets-list.component.html',
  styleUrls: ['./wallets-list.component.css']
})
export class WalletsListComponent implements OnInit {
  wallets$: Observable<IWallet[]> = this.store.select((state) => state.wallets.wallets);
  isLoading$: Observable<boolean> = this.store.select((state) => state.wallets.isLoading);

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    console.log('Dispatching fetchAllWallets action...');
    this.store.dispatch(fetchAllWallets());
  }
}
