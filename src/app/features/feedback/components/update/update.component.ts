import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FeedbackService } from '../../services/feedback.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-feedback',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateFeedbackComponent implements OnInit {
  feedbackForm: FormGroup;
  feedbackId: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private feedbackService: FeedbackService
  ) {
    this.feedbackId = this.route.snapshot.params['id'];
    this.feedbackForm = this.fb.group({
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['']
    });
  }

  ngOnInit(): void {
    this.feedbackService.getFeedbackById(this.feedbackId).subscribe({
      next: (data) => this.feedbackForm.patchValue(data),
      error: (error) => console.error('Erreur lors de la récupération du feedback:', error)
    });
  }

  onSubmit(): void {
    if (this.feedbackForm.valid) {
      this.feedbackService.updateFeedback(this.feedbackId, this.feedbackForm.value).subscribe({
        next: () => {
          alert('Feedback mis à jour avec succès!');
          this.router.navigate(['/feedback/list']);
        },
        error: (error) => alert('Erreur lors de la mise à jour du feedback.')
      });
    }

    this.router.navigate(['/feedbacks/list']);
  }

}
