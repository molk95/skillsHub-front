import { Component } from '@angular/core';
import { FeedbackService } from '../../services/feedback.service';

@Component({
  selector: 'app-average-rating',
  templateUrl: './average-rating.component.html',
  styleUrls: ['./average-rating.component.css']
})
export class AverageRatingComponent {
  userId: string = ''; // User ID input from the user
  averageRating: number | null = null;
  errorMessage: string | null = null;

  constructor(private feedbackService: FeedbackService) {}

  getAverageRating(): void {
    if (!this.userId.trim()) {
      this.errorMessage = 'Veuillez entrer un ID utilisateur valide.';
      return;
    }

    this.feedbackService.getAverageRating(this.userId).subscribe({
      next: (data) => {
        this.averageRating = data.averageRating;
        this.errorMessage = null;
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la récupération de la note moyenne.';
        this.averageRating = null;
      }
    });
  }

}
