import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Badge, BadgeEnum } from '../../models/badge.model';
import { BadgeService } from '../../service/badge.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-badge-form',
  templateUrl: './badge-form.component.html',
  styleUrls: ['./badge-form.component.css']
})
export class BadgeFormComponent implements OnInit{
  badgeForm!: FormGroup;
  badgeId: string | null = null;
  badgeTypes = Object.values(BadgeEnum);

  constructor(
    private fb: FormBuilder,
    private badgeService: BadgeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.badgeId = this.route.snapshot.paramMap.get('id');
    this.badgeForm = this.fb.group({
      userId: ['', Validators.required],
      challengeId: ['', Validators.required],
      score: [0, [Validators.required, Validators.min(0)]]
    });

    if (this.badgeId) {
      this.loadBadge();
    }
  }

  loadBadge(): void {
    const userId = this.route.snapshot.paramMap.get('userId'); // Récupérer l'ID utilisateur depuis l'URL
    const badgeId = this.badgeId; // L'ID spécifique du badge que vous voulez charger
  
    if (userId) {
      this.badgeService.getBadgesByUser(userId).subscribe({
        next: (badges) => {
          const badge = badges.find((b) => b._id === badgeId); // Rechercher le badge spécifique par son ID
          if (badge) {
            this.badgeForm.patchValue(badge); // Mettre à jour le formulaire avec les données du badge
          } else {
            console.error(`Badge avec l'ID ${badgeId} non trouvé pour l'utilisateur ${userId}`);
          }
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des badges :', error);
        },
      });
    } else {
      console.error('Aucun ID utilisateur fourni dans l\'URL.');
    }
  }

  saveBadge(): void {
    if (this.badgeForm.invalid) return;

    const badge: Partial<Badge> = this.badgeForm.value;

    this.badgeService.createBadge(badge).subscribe(() => {
      this.router.navigate(['/badges']);
    });
  
  }

}

