import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeedbackService } from '../../services/feedback.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-feedback',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateFeedbackComponent implements OnInit {
  feedbackForm: FormGroup;
  
  constructor(private fb: FormBuilder, private feedbackService: FeedbackService, private router: Router) {
    this.feedbackForm = this.fb.group({
      userId: ['', Validators.required],
      targetUserId: ['', Validators.required],
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['']
    });
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onSubmit(): void {
    if (this.feedbackForm.valid) {
      this.feedbackService.createFeedback(this.feedbackForm.value).subscribe({
        next: (response) => alert('Feedback créé avec succès!'),
        error: (error) => alert('Erreur lors de la création du feedback.')

      });
      this.router.navigate(['/feedbacks/list']);
    }
    
  }

}
