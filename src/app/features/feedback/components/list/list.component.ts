import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '../../services/feedback.service';
import { Router } from '@angular/router';
import { Feedback } from '../../models/feedback.models';

@Component({
  selector: 'app-list-feedback',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListFeedbackComponent implements OnInit {
  feedbacks: any[] = [];
  fetchedfeedback: Feedback[] = [];

  constructor(private feedbackService: FeedbackService, private router: Router) { }

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks(): void {
    this.feedbackService.getAllFeedbacks().subscribe({
      next: (data) => {
        this.fetchedfeedback = data;
        this.feedbacks = this.fetchedfeedback;
        
      },
      error: (err) => {
        console.error('Erreur lors du chargement des feedbacks :', err);
      }
    });
  }


  deleteFeedback(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce feedback ?')) {
      this.feedbackService.deleteFeedback(id).subscribe(() => {
        // Recharge la liste après suppression
        this.loadFeedbacks();
      });
    }
  }

}
