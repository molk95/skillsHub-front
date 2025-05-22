import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '../../services/feedback.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-feedback',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListFeedbackComponent implements OnInit{
  feedbacks: any[] = [];

  constructor(private feedbackService: FeedbackService, private router: Router) {}

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks(): void {
    this.feedbackService.getAllFeedbacks().subscribe((data) => {
      this.feedbacks = data;
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
