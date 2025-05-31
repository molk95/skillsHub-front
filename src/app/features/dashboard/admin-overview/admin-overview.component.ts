import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const backendServer = 'http://localhost:3000';

@Component({
  selector: 'app-admin-overview',
  templateUrl: './admin-overview.component.html',
  styleUrls: ['./admin-overview.component.css'],
})
export class AdminOverviewComponent implements OnInit {
  stats = {
    totalUsers: 0,
    totalSkills: 0,
    totalChallenges: 0,
    totalFeedbacks: 0,
    totalCommunities: 0,
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics() {
    // Load users count
    this.http.get<any[]>(`${backendServer}/api/users`).subscribe({
      next: (users) => (this.stats.totalUsers = users.length),
      error: (err) => console.error('Error loading users:', err),
    });

    // Load skills count
    this.http.get<any[]>(`${backendServer}/api/skill-market`).subscribe({
      next: (skills) => (this.stats.totalSkills = skills.length),
      error: (err) => console.error('Error loading skills:', err),
    });

    // Load challenges count (adjust API endpoint as needed)
    this.http.get<any[]>(`${backendServer}/api/challenges`).subscribe({
      next: (challenges) => (this.stats.totalChallenges = challenges.length),
      error: (err) => console.error('Error loading challenges:', err),
    });

    // Load feedbacks count (adjust API endpoint as needed)
    this.http.get<any[]>(`${backendServer}/api/feedbacks`).subscribe({
      next: (feedbacks) => (this.stats.totalFeedbacks = feedbacks.length),
      error: (err) => console.error('Error loading feedbacks:', err),
    });

    // Load communities count
    this.http
      .get<{ count: number }>(`${backendServer}/api/communities/count`)
      .subscribe({
        next: (response) => (this.stats.totalCommunities = response.count),
        error: (err) => console.error('Error loading communities:', err),
      });
  }
}
