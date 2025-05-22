import { Component } from '@angular/core';
import { FeedbackService } from '../../services/feedback.service';

@Component({
  selector: 'app-top-rated-users',
  templateUrl: './top-rated-users.component.html',
  styleUrls: ['./top-rated-users.component.css']
})
export class TopRatedUsersComponent {
  topUsers: { _id: string; averageRating: number; count: number }[] = [];
  errorMessage: string | null = null;

  constructor(private feedbackService: FeedbackService) {}

  ngOnInit(): void {
    this.feedbackService.getTopRatedUsers().subscribe({
      next: (data) => (this.topUsers = data),
      error: () => (this.errorMessage = 'Erreur lors de la récupération des utilisateurs les mieux notés.')
    });
  }

}
