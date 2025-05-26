import { Component, OnInit } from '@angular/core';
import { Challenge } from '../../models/challenges.models';
import { ChallengeService } from '../../service/challenge.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-challenge-list',
  templateUrl: './challenge-list.component.html',
  styleUrls: ['./challenge-list.component.css']
})
export class ChallengeListComponent implements OnInit {
  user: any;
currentUser: any;
role: any;
  challenges: Challenge[] = [];

  constructor(
    private challengeService: ChallengeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = localStorage.getItem('user');
    if (!this.user) {
      // Gérer l'absence d'utilisateur
      return;
    }
  
    this.currentUser = JSON.parse(this.user);
    this.role = this.currentUser.role;
  
    if (this.role === 'ADMIN') {
      this.fetchAllChallenges();
    }
  }
  
  fetchAllChallenges(): void {
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

  selectChallenge(challenge: Challenge): void {
    localStorage.setItem('selectedChallenge', JSON.stringify(challenge));
    // Rediriger vers la page trivia
    this.router.navigate(['/challenges/trivia']);
  }

}
