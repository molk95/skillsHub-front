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
  currentUserId: string = ''; // À remplacer par l'ID de l'utilisateur connecté

  constructor(private marketplaceService: MarketplaceService) {}

  ngOnInit(): void {
    // Récupérer l'ID utilisateur depuis le localStorage ou un service d'authentification
    // au lieu d'utiliser une valeur codée en dur
    this.currentUserId = localStorage.getItem('userId') || '680bc3701cafa75c695bac60';
    console.log('ID utilisateur pour le matching:', this.currentUserId);
    this.loadMatchingData();
  }

  loadMatchingData(): void {
    this.isLoading = true;
    this.error = null;
    
    // Charger les utilisateurs avec des compétences similaires
    this.marketplaceService.findMatchingSkills(this.currentUserId).subscribe({
      next: (data) => {
        this.matchingUsers = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des utilisateurs correspondants';
        this.isLoading = false;
        console.error(err);
      }
    });

    // Charger les suggestions de compétences
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
