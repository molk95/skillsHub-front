import { Component, OnInit } from '@angular/core';
import { MarketplaceService } from '../marketplace/Skills/services/marketplace.service';
import { Skill } from '../marketplace/Skills/model/skill.model';
import { Category } from '../marketplace/Category/model/category.model';
import { Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-marketplace-client',
  templateUrl: './marketplace-client.component.html',
  styleUrls: ['./marketplace-client.component.css']
})
export class MarketplaceClientComponent implements OnInit {
  skills: Skill[] = [];
  categories: Category[] = [];
  selectedCategory: string = '';
  searchText: string = '';
  allSkills: Skill[] = [];
  currentUserId: string = '';

  constructor(
    private router: Router,
    private marketplaceService: MarketplaceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadSkills();

    // Récupère l'utilisateur depuis le localStorage (manuellement, comme dans add-skill)
    const userString = localStorage.getItem('user');
    console.log('User localStorage:', userString);
    if (userString) {
      try {
        const user = JSON.parse(userString);
        this.currentUserId = user._id || user.id || user.userId || '';
        if (!this.currentUserId) {
          console.warn('Aucun ID utilisateur trouvé dans le localStorage:', user);
        }
      } catch (e) {
        console.error('Erreur de parsing du user depuis localStorage:', e);
      }
    } else {
      console.warn('Aucun utilisateur trouvé dans le localStorage.');
    }

    this.marketplaceService.getAllCategory().subscribe((data) => {
      this.categories = data;
    });
  }

  loadSkills(): void {
    this.marketplaceService.getAllSkills().subscribe((data) => {
      this.skills = data;
      this.allSkills = data;
    });
  }

  searchSkills(): void {
    if (!this.selectedCategory && !this.searchText) {
      this.skills = this.allSkills;
      return;
    }

    if (this.selectedCategory && !this.searchText) {
      this.marketplaceService.getSkillsByCategory(this.selectedCategory).subscribe({
        next: (data) => {
          this.skills = data;
        },
        error: (err) => {
          this.filterSkillsLocally();
        }
      });
      return;
    }

    this.filterSkillsLocally();
  }

  private filterSkillsLocally(): void {
    this.skills = this.allSkills.filter(skill => {
      const matchesCategory = !this.selectedCategory || 
                             (skill.category && skill.category.name === this.selectedCategory);
      const matchesText = !this.searchText || 
                         skill.name.toLowerCase().includes(this.searchText.toLowerCase());
      return matchesCategory && matchesText;
    });
  }

  onViewDetail(skill: Skill): void {
    this.router.navigate(['MarketplaceDetail', skill._id]);
  }

  addskill(): void {
    this.router.navigate(['skill/add']);  
  }

  onEditSkill(skill: Skill): void {
    this.marketplaceService.setSelectedSkill(skill);
    this.router.navigate(['/upd-skil', skill._id]);
  }

onDeleteSkill(skill: Skill): void {
  // Vérifie si le skill appartient à l'utilisateur actuel
  const tutorId = typeof skill.user === 'object' && skill.user !== null
    ? skill.user._id
    : skill.user;

  if (tutorId !== this.currentUserId) {
    alert("⛔ Vous n'êtes pas autorisé à supprimer cette compétence.");
    return;
  }

  // Confirmation avant suppression
  const confirmed = confirm(`🗑️ Supprimer la compétence "${skill.name}" ?`);
  if (confirmed) {
    this.router.navigate(['DelSkill', skill._id]);
  }
}

goToAddSkill(): void {
  this.router.navigate(['/add-skill']);
}

  goToSalon(skill: Skill): void {
    const skillName = skill.name || '';
    let tutorName = '';
    if (typeof skill.user === 'object' && skill.user.fullName) {
      tutorName = skill.user.fullName;
    }

    this.router.navigate(['/salons/list'], { 
      queryParams: { 
        skillName: skillName,
        tutorName: tutorName 
      } 
    });
  }

  goToSession(skill: Skill): void {
    this.router.navigate(['sessions/list'], { queryParams: { skillName: skill.name } });
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
}
