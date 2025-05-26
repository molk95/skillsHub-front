import { Component } from '@angular/core';
import { Challenge } from '../../models/challenges.models';
import { ChallengeService } from '../../service/challenge.service';

@Component({
  selector: 'app-challenge-upcoming',
  templateUrl: './challenge-upcoming.component.html',
  styleUrls: ['./challenge-upcoming.component.css']
})
export class ChallengeUpcomingComponent {
  upcomingChallenges: Challenge[] = []; // Stocke les données des défis à venir
  errorMessage: string | null = null;

  constructor(private challengeService: ChallengeService) {}

  ngOnInit(): void {
    this.fetchUpcomingChallenges(); // Appelle la méthode pour récupérer les défis à venir
  }

  fetchUpcomingChallenges(): void {
    this.challengeService.getUpcoming().subscribe({
      next: (challenges) => {
        console.log('Défis à venir reçus :', challenges);
        this.upcomingChallenges = challenges; // Affecte les données reçues
        this.errorMessage = null; // Réinitialise les erreurs
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des défis à venir :', error.message);
        this.errorMessage = 'Impossible de récupérer les défis à venir. Veuillez réessayer.';
      },
    });
  }

}
