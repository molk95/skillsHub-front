import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarketplaceService } from '../../services/marketplace.service';
import { Skill } from '../../model/skill.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-marketplace-detail',
  templateUrl: './marketplace-detail.component.html',
  styleUrls: ['./marketplace-detail.component.css']
})
export class MarketplaceDetailComponent implements OnInit {
  skill: Skill | null = null;
  error: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private marketplaceService: MarketplaceService
  ) {}

  ngOnInit(): void {
    this.loadSkillData();

      const id = this.route.snapshot.paramMap.get('id');
  if (id) {
    this.marketplaceService.getSkillById(id).subscribe(skill => {
      console.log('Skill chargé:', skill);
      this.skill = skill;
    });
  }

  }

  loadSkillData(): void {
    const skillId = this.route.snapshot.paramMap.get('id');
    
    if (skillId) {
      this.error = false;
      this.marketplaceService.getSkillById(skillId).subscribe({
        next: (data) => {
          this.skill = data;
          console.log('Skill details loaded:', this.skill);
        },
        error: (err) => {
          this.error = true;
          this.errorMessage = err.message || 'Une erreur est survenue';
          console.error('Erreur lors du chargement de la compétence', err);
        }
      });
    }
  }

  reloadData(): void {
    this.loadSkillData();
  }
  goToSalon(skill: any) {
    // Récupérer le nom de la compétence et le nom du tuteur
    const skillName = skill.name || '';
    
    // Récupérer le nom du tuteur (utilisateur)
    let tutorName = '';
    if (typeof skill.user === 'object' && skill.user.fullName) {
      tutorName = skill.user.fullName;
    }
    
    console.log(`Recherche de salons pour la compétence "${skillName}" et le tuteur "${tutorName}"`);
    
    // Naviguer vers la liste des salons avec les paramètres de recherche
    this.router.navigate(['/salons/list'], { 
      queryParams: { 
        skillName: skillName,
        tutorName: tutorName 
      } 
    });
  }
getUserInfo(skill: Skill): string {
  if (!skill.user) {
    return 'Non défini (user manquant)';
  }
  if (typeof skill.user === 'object') {
    return skill.user.fullName || 'Nom utilisateur non disponible';
  }
  return `Utilisateur ID: ${skill.user}`;
}


 goToSession(skill: any) {
  // Envoie le nom du skill en query param "skillName"
  this.router.navigate(['sessions/list'], { queryParams: { skillName: skill.name } });
}
}



