import { Component, OnInit } from '@angular/core';
import { Badge } from '../../models/badge.model';
import { BadgeService } from '../../service/badge.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-badge-list',
  templateUrl: './badge-list.component.html',
  styleUrls: ['./badge-list.component.css']
})
export class BadgeListComponent implements OnInit{
  badges: Badge[] = [];
  errorMessage: string | null = null;
  userId: string | null = null;
  searchType: string = ''; // Valeur par défaut (pas de filtre)
  

  constructor(
    private route: ActivatedRoute, 
    private badgeService: BadgeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Puisque nous n'utilisons pas l'authentification pour le moment,
    // nous allons simplement afficher tous les badges
    this.fetchAllBadges();
  }

  fetchAllBadges(): void {
    this.badgeService.getAllBadges().subscribe({
      next: (badges) => {
        this.badges = badges;
        console.log("id badge ",badges)
        this.errorMessage = null;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des badges :', error);
        this.errorMessage = 'Impossible de récupérer les badges.';
      },
    });
  }

  fetchBadges(): void {
    this.badgeService.getBadgesByUser(this.userId!).subscribe({
      next: (badges) => {
        this.badges = badges;
        this.errorMessage = null; // Réinitialise l'erreur
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des badges :', error);
        this.errorMessage = 'Impossible de récupérer les badges.';
      },
    });
  }

  deleteBadge(id: string): void {
    this.badgeService.deleteBadge(id).subscribe({
      next: () => {
        this.badges = this.badges.filter((badge) => badge._id !== id);
      },
      error: (error) => {
        console.error('Erreur lors de la suppression du badge :', error);
      },
    });
  }

  navigateToUserBadges(): void {
    if (this.userId && this.userId !== 'null') {
      this.router.navigate(['/badges/user', this.userId]);
    } else {
      this.errorMessage = 'Vous devez être connecté pour voir vos badges.';
    }
  }
  filteredBadges(): Badge[] {
    if (!this.searchType) {
      return this.badges;
    }
    return this.badges.filter(badge => badge.type.toLowerCase() === this.searchType.toLowerCase());
  }
}




