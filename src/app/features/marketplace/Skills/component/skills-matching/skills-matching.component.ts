import { Component, OnInit } from '@angular/core';
import { MarketplaceService } from '../../services/marketplace.service';

@Component({
  selector: 'app-skills-matching',
  templateUrl: './skills-matching.component.html',
  styleUrls: ['./skills-matching.component.css']
})
export class SkillsMatchingComponent implements OnInit {
  matchingUsers: any[] = [];
  suggestedSkills: any[] = [];
  isLoading = false;
  error: string | null = null;
  currentUserId: string = '';

  constructor(private marketplaceService: MarketplaceService) {}

  ngOnInit(): void {
    const storedId = localStorage.getItem('userId');

    if (!storedId) {
      this.error = 'Utilisateur non connecté ou ID utilisateur manquant.';
      console.error('Aucun ID utilisateur trouvé dans le localStorage');
      return;
    }

    this.currentUserId = storedId;
    console.log('ID utilisateur pour le matching:', this.currentUserId);
    this.loadMatchingData();
  }

  loadMatchingData(): void {
    this.isLoading = true;
    this.error = null;

    // 1. Charger les utilisateurs similaires
    this.marketplaceService.findMatchingSkills(this.currentUserId).subscribe({
      next: (data) => {
        this.matchingUsers = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des utilisateurs correspondants';
        this.isLoading = false;
        console.error('Erreur matching skills:', err);
      }
    });

    // 2. Charger les suggestions de compétences
    this.marketplaceService.suggestSkills(this.currentUserId).subscribe({
      next: (data) => {
        this.suggestedSkills = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des suggestions:', err);
      }
    });
  }
}