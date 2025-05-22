import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FeedbackService } from '../../services/feedback.service';

@Component({
  selector: 'app-details-feedback',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsFeedbackComponent implements OnInit {
  feedback: any;

  constructor(private route: ActivatedRoute, private feedbackService: FeedbackService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.feedbackService.getFeedbackById(id).subscribe({
      next: (data) => this.feedback = data,
      error: (error) => console.error('Erreur lors de la récupération du feedback:', error)
    });
  }

}
