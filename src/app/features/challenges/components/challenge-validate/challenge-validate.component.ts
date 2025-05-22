import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChallengeService } from '../../service/challenge.service';

@Component({
  selector: 'app-challenge-validate',
  templateUrl: './challenge-validate.component.html',
  styleUrls: ['./challenge-validate.component.css']
})
export class ChallengeValidateComponent {
  validateForm!: FormGroup;
  validationResult: string = '';

  constructor(private fb: FormBuilder, private challengeService: ChallengeService) {
    this.validateForm = this.fb.group({
      userId: ['', Validators.required],
      challengeId: ['', Validators.required],
      score: ['', [Validators.required, Validators.min(0), Validators.max(200)]],
    });
  }

  onSubmit(): void {
    if (this.validateForm.invalid) {
      return;
    }

    const formData = this.validateForm.value;
    this.challengeService.validateCompletion(formData).subscribe(
      (response) => {
        this.validationResult = `Challenge ${response.challengeId} for user ${response.userId} is ${response.status} with a score of ${response.score}.`;
      },
      (error) => {
        this.validationResult = 'An error occurred. Please try again.';
      }
    );
  }

}
