import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '../../services/feedback.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-delete-feedback',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteFeedbackComponent{
  constructor(
    private feedbackService: FeedbackService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  deleteFeedback(): void {
    const id = this.route.snapshot.params['id'];
    this.feedbackService.deleteFeedback(id).subscribe({
      next: () => {
        alert('Feedback supprimé avec succès!');
        this.router.navigate(['/feedback/list']);
      },
      error: (error) => alert('Erreur lors de la suppression du feedback.')
    });
  }

}
