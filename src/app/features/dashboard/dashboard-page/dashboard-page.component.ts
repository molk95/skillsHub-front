import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css'],
})
export class DashboardPageComponent implements OnInit {
  profile: any; // To store profile data

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getProfile()?.subscribe(
      (profile) => {
        this.profile = profile;
        console.log('User Profile:', this.profile); // Log the profile data
      },
      (error) => {
        console.error('Error fetching profile:', error); // Handle any error that might occur
      }
    );
  }
}
