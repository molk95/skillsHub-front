import { Component, OnInit } from '@angular/core';
import { Badge } from '../../models/badge.model';
import { BadgeService } from '../../service/badge.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-badge-detail',
  templateUrl: './badge-detail.component.html',
  styleUrls: ['./badge-detail.component.css']
})
export class BadgeDetailComponent implements OnInit{
  userId: string = '';
  badges: any[] = [];
  //userId: string | null = null; // Pour stocker l'ID utilisateur
  //badges: Badge[] = []; // Liste des badges récupérés
  selectedBadge: Badge | null = null; // Badge actuellement sélectionné
  errorMessage: string | null = null; // Pour afficher un message d'erreur

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private badgeService: BadgeService
  ) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId') || '';
    
    if (!this.userId || this.userId === 'null') {
      this.errorMessage = 'Aucun utilisateur connecté. Veuillez vous authentifier.';
      return;
    }

    this.badgeService.getBadgesByUser(this.userId).subscribe({
      next: (data) => this.badges = data,
      error: (err) => {
        console.error('Erreur récupération badges utilisateur :', err);
        this.errorMessage = 'Erreur lors de la récupération des badges.';
      }
    });
  }

  fetchBadges(): void {
    if (!this.userId || this.userId === 'null') {
      console.error('Cannot fetch badges without a valid user ID.');
      return;
    }

    console.log('Fetching badges for user ID:', this.userId);

    this.badgeService.getBadgesByUser(this.userId).subscribe({
      next: (badges) => {
        this.badges = badges;
        this.errorMessage = null; // Reset error message
      },
      error: (error) => {
        console.error('Error while fetching badges:', error);
        this.errorMessage = 'Unable to fetch badges.';
      },
    });
  }

  loadBadges(userId: string): void {
    this.badgeService.getBadgesByUser(userId).subscribe({
      next: (badges) => {
        console.log('Badges reçus du backend :', badges);
        this.badges = badges;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des badges :', error);
        this.errorMessage = 'Erreur lors de la récupération des badges.';
      }
    });
  }

  // Fonction pour sélectionner un badge
  selectBadge(badge: Badge): void {
    this.selectedBadge = badge;
    console.log('Badge sélectionné:', this.selectedBadge);
  }


}


