import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarketplaceService } from '../../services/marketplace.service';
import { Skill } from '../../models/skill.model';

@Component({
  selector: 'app-marketplace-detail',
  templateUrl: './marketplace-detail.component.html',
  styleUrls: ['./marketplace-detail.component.css']
})
export class MarketplaceDetailComponent implements OnInit {
  skill: any | null = null;
  error: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private marketplaceService: MarketplaceService
  ) {}

  ngOnInit(): void {
    this.loadSkillData();
  }

  loadSkillData(): void {
    const skillId = this.route.snapshot.paramMap.get('id');
    
    if (skillId) {
      this.error = false;
      this.marketplaceService.getSkillById(skillId).subscribe({
        next: (data) => {
          this.skill = data;
          console.log('Skill details loaded:', this.skill);
        },
        error: (err) => {
          this.error = true;
          this.errorMessage = err.message || 'Une erreur est survenue';
          console.error('Erreur lors du chargement de la compétence', err);
        }
      });
    }
  }

  reloadData(): void {
    this.loadSkillData();
  }
}



