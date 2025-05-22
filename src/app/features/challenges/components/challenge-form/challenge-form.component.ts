import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChallengeService } from '../../service/challenge.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-challenge-form',
  templateUrl: './challenge-form.component.html',
  styleUrls: ['./challenge-form.component.css']
})
export class ChallengeFormComponent implements OnInit{
  challengeForm!: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private challengeService: ChallengeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.challengeForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      skill: ['', Validators.required],
      difficulty: ['medium', Validators.required],
      startDate: ['', Validators.required],
      createdBy: ['', [Validators.required]]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.challengeService.getById(id).subscribe(data => {
        this.challengeForm.patchValue(data);
      });
    }
  }

  onSubmit(): void {
    if (this.challengeForm.invalid) return;

    if (this.isEdit) {
      const id = this.route.snapshot.paramMap.get('id');
      this.challengeService.update(id!, this.challengeForm.value).subscribe(() => {
        this.router.navigate(['/challenges']);
      });
    } else {
      this.challengeService.create(this.challengeForm.value).subscribe(() => {
        this.router.navigate(['/challenges']);
      });
    }
  }

}
