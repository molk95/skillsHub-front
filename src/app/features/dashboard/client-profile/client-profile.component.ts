import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { HttpClient } from '@angular/common/http';

const backendServer = 'http://localhost:3000';

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.css'],
})
export class ClientProfileComponent implements OnInit {
  profile: any = null;
  loading = true;
  fullSkills: any[] = []; // To store full skill details

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    // Get user from localStorage
    const userString = localStorage.getItem('user');
    if (userString) {
      this.profile = JSON.parse(userString);
      this.loadSkillDetails();
    } else {
      // Fallback to API call
      this.authService.getProfile()?.subscribe({
        next: (profile) => {
          this.profile = profile;
          this.loadSkillDetails();
        },
        error: (err) => {
          console.error('Error loading profile:', err);
          this.loading = false;
        },
      });
    }
  }

  loadSkillDetails() {
    if (this.profile?.skills && this.profile.skills.length > 0) {
      // Build the query string with skill IDs
      const skillIds = this.profile.skills;
      const queryParams = skillIds.map((id: string) => `ids=${id}`).join('&');

      this.http
        .get<any[]>(`${backendServer}/api/skill-market/by-ids?${queryParams}`)
        .subscribe({
          next: (skills) => {
            this.fullSkills = skills;
            this.loading = false;
          },
          error: (err) => {
            console.error('Error loading skill details:', err);
            this.fullSkills = [];
            this.loading = false;
          },
        });
    } else {
      this.fullSkills = [];
      this.loading = false;
    }
  }
}
