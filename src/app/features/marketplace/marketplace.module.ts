import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AddSkillComponent } from './component/add-skill/add-skill.component';
import { MarketplaceListComponent } from './component/marketplace-list/marketplace-list.component';
import { MarketplaceDetailComponent } from './component/marketplace-detail/marketplace-detail.component';
import { UpdSkilComponent } from './component/upd-skil/upd-skil.component';

@NgModule({
  declarations: [
    AddSkillComponent,
    MarketplaceListComponent,
    MarketplaceDetailComponent,
    UpdSkilComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    AddSkillComponent,
    MarketplaceListComponent,
    MarketplaceDetailComponent,
    UpdSkilComponent
  ]
})
export class MarketplaceModule { }