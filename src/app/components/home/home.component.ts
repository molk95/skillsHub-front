import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Check if user is authenticated
    this.checkAuthentication();
  }

  private checkAuthentication(): void {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (!user) {
      // Redirect unauthenticated users to login
      this.router.navigate(['/logIn']);
    }
  }

  // Navigation methods for authenticated users
  navigateToSkills(): void {
    this.router.navigate(['/skills']);
  }

  navigateToChallenges(): void {
    this.router.navigate(['/challenges']);
  }

  navigateToCommunities(): void {
    this.router.navigate(['/communities']);
  }

  navigateToSalons(): void {
    this.router.navigate(['/salons']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/logIn']);
  }

  navigateToSignup(): void {
    this.router.navigate(['/signUp']);
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    this.router.navigate(['/logIn']);
  }

  isAuthenticated(): boolean {
    const userStr = localStorage.getItem('user');
    return !!userStr;
  }

  getUserName(): string {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.fullName || user.name || 'User';
    }
    return '';
  }
}
