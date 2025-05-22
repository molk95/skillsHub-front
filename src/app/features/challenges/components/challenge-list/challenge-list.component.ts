import { Component, OnInit } from '@angular/core';
import { Challenge } from '../../models/challenges.models';
import { ChallengeService } from '../../service/challenge.service';

@Component({
  selector: 'app-challenge-list',
  templateUrl: './challenge-list.component.html',
  styleUrls: ['./challenge-list.component.css']
})
export class ChallengeListComponent implements OnInit {
  challenges: Challenge[] = [];

  constructor(private challengeService: ChallengeService) {}

  ngOnInit(): void {
    this.challengeService.getAll().subscribe(data => {
      this.challenges = data;
    });
  }

  deleteChallenge(id: string): void {
    if (confirm('Are you sure you want to delete this challenge?')) {
      this.challengeService.delete(id).subscribe(() => {
        this.challenges = this.challenges.filter(challenge => challenge._id !== id);
      });
    }
  }

}
