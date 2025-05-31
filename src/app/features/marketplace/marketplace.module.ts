import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MarketplaceListComponent } from './Skills/component/marketplace-list/marketplace-list.component';
import { MarketplaceDetailComponent } from './Skills/component/marketplace-detail/marketplace-detail.component';
import { AddSkillComponent } from './Skills/component/add-skill/add-skill.component';
import { UpdSkilComponent } from './Skills/component/upd-skil/upd-skil.component';
import { SkillsMatchingComponent } from './Skills/component/skills-matching/skills-matching.component';

@NgModule({
  declarations: [
    MarketplaceListComponent,
    MarketplaceDetailComponent,
    AddSkillComponent,
    UpdSkilComponent,
    SkillsMatchingComponent 
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    MarketplaceListComponent,
    MarketplaceDetailComponent,
    AddSkillComponent,
    UpdSkilComponent,
    SkillsMatchingComponent 
  ]
})
export class MarketplaceModule { }
