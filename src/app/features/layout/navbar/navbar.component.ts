import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
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

  // Navigation methods
  navigateToHome(): void {
    this.router.navigate(['/home']);
    this.closeMenu();
  }

  navigateToSkills(): void {
    this.router.navigate(['/MarketplaceList']);
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
    this.router.navigate(['/logIn']);
    this.closeMenu();
  }

  private closeMenu(): void {
    this.isMenuOpen = false;
  }
}
