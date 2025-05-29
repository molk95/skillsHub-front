import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  navigateToContact(): void {
    this.router.navigate(['/contact']);
  }

  navigateToSignup(): void {
    this.router.navigate(['/signUp']);
  }
}
