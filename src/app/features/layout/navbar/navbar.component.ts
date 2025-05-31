import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

const backendServer = 'http://localhost:3000';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  communityCount = 0;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.loadCommunityCount();
    }
  }

  loadCommunityCount(): void {
    this.http
      .get<{ count: number }>(`${backendServer}/api/communities/count`)
      .subscribe({
        next: (response) => {
          this.communityCount = response.count;
        },
        error: (err) => {
          console.error('Error loading community count:', err);
          this.communityCount = 0;
        },
      });
  }

  // Public method to refresh community count (can be called from other components)
  refreshCommunityCount(): void {
    if (this.isAuthenticated()) {
      this.loadCommunityCount();
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Authentication methods
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

  getUserInitial(): string {
    const userName = this.getUserName();
    if (userName && userName.length > 0) {
      return userName.charAt(0).toUpperCase();
    }
    return 'U';
  }

  getUserRole(): string {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.role || 'CLIENT';
    }
    return 'CLIENT';
  }

  // Navigate to user dashboard based on role
  navigateToProfile(): void {
    const userRole = this.getUserRole();
    if (userRole === 'ADMIN') {
      this.router.navigate(['/dashboard/admin']);
    } else {
      this.router.navigate(['/dashboard/client']);
    }
    this.closeMenu();
    // Refresh community count when navigating to profile
    this.loadCommunityCount();
  }

  // Navigation methods
  navigateToHome(): void {
    this.router.navigate(['/home']);
    this.closeMenu();
  }

  navigateToSkills(): void {
    this.router.navigate(['/MarketplaceClient']);
    this.closeMenu();
  }

  navigateToChallenges(): void {
    this.router.navigate(['/challenges']);
    this.closeMenu();
  }

  navigateToCommunities(): void {
    this.router.navigate(['/communities']);
    this.closeMenu();
  }

  navigateToForums(): void {
    this.router.navigate(['/forums']);
    this.closeMenu();
  }

  navigateToEvents(): void {
    this.router.navigate(['/events']);
    this.closeMenu();
  }

  navigateToSalons(): void {
    this.router.navigate(['/salons/list']);
    this.closeMenu();
  }

  navigateToWallet(): void {
    this.router.navigate(['/wallets/wallet-dashboard']);
    this.closeMenu();
  }

  navigateToLogin(): void {
    this.router.navigate(['/logIn']);
    this.closeMenu();
  }

  navigateToSignup(): void {
    this.router.navigate(['/signUp']);
    this.closeMenu();
  }

  navigateToAbout(): void {
    this.router.navigate(['/about']);
    this.closeMenu();
  }

  navigateToContact(): void {
    this.router.navigate(['/contact']);
    this.closeMenu();
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('auth_token');
    this.communityCount = 0; // Reset community count on logout
    this.router.navigate(['/logIn']);
    this.closeMenu();
  }

  private closeMenu(): void {
    this.isMenuOpen = false;
  }
}
