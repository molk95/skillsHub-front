import { Component, OnInit } from '@angular/core';
import { Badge } from '../../models/badge.model';
import { BadgeService } from '../../service/badge.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-badge-list',
  templateUrl: './badge-list.component.html',
  styleUrls: ['./badge-list.component.css']
})
export class BadgeListComponent implements OnInit {
  badges: Badge[] = [];
  errorMessage: string | null = null;
  user: any;
  currentUser: any;
  searchType: string = ''; // Valeur par défaut (pas de filtre)
  role: any;

  constructor(
    private route: ActivatedRoute,
    private badgeService: BadgeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupération des données utilisateur depuis le localStorage
    this.user = localStorage.getItem('user');

    if (!this.user) {
      this.errorMessage = 'Utilisateur non connecté.';
      return;
    }

    this.currentUser = JSON.parse(this.user);
    this.role = this.currentUser.role;

    console.log("role user ", this.role);
    console.log("id user ", this.currentUser.id);

    // Afficher les badges selon le rôle
    if (this.role === 'ADMIN') {
      this.fetchAllBadges();
    } else if (this.role === 'CLIENT') {
      this.fetchBadges();
    }
  }

  fetchAllBadges(): void {
    this.badgeService.getAllBadges().subscribe({
      next: (badges) => {
        this.badges = badges;
        console.log("Badges récupérés :", badges);
        this.errorMessage = null;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des badges :', error);
        this.errorMessage = 'Impossible de récupérer les badges.';
      },
    });
  }

  fetchBadges(): void {
    this.badgeService.getBadgesByUser(this.currentUser.id).subscribe({
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
    if (this.currentUser.id && this.currentUser.id !== 'null') {
      this.router.navigate(['/badges/user', this.currentUser.id]);
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
