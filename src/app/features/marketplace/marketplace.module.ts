import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Composants existants
import { MarketplaceListComponent } from './component/marketplace-list/marketplace-list.component';
import { MarketplaceDetailComponent } from './component/marketplace-detail/marketplace-detail.component';
import { AddSkillComponent } from './component/add-skill/add-skill.component';
import { UpdSkilComponent } from './component/upd-skil/upd-skil.component';
// Nouveau composant
import { SkillsMatchingComponent } from './component/skills-matching/skills-matching.component';

@NgModule({
  declarations: [
    MarketplaceListComponent,
    MarketplaceDetailComponent,
    AddSkillComponent,
    UpdSkilComponent,
    SkillsMatchingComponent // Ajout du nouveau composant
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
    SkillsMatchingComponent // Export du nouveau composant
  ]
})
export class MarketplaceModule { }
