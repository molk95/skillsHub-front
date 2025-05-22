import { Component } from '@angular/core';
import { BadgeService } from '../../service/badge.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent {
  leaderboard: any[] = [];
  errorMessage: string | null = null;

  constructor(private badgeService: BadgeService) {}

  ngOnInit(): void {
    this.fetchLeaderboard();
  }

  fetchLeaderboard(): void {
    this.badgeService.getLeaderboard().subscribe({
      next: (data) => {
        this.leaderboard = data;
        this.errorMessage = null;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du leaderboard :', error);
        this.errorMessage = 'Impossible de récupérer le leaderboard.';
      },
    });
  }

}
