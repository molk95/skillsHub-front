import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  brandName = 'SkillsHUB';
  tagline = 'Empowering tech communities with gamification and real-time tools';
  features = [
    'Create and manage communities like a mini Discord',
    'Engage with forums and events',
    'Earn points, rewards and achievements',
    'Chat and collaborate in real-time'
  ];
}
