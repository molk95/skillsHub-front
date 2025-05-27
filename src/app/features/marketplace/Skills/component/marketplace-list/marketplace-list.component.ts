import { Component, OnInit } from '@angular/core';
import { MarketplaceService } from '../../services/marketplace.service';
import { Skill } from '../../model/skill.model';
import { Category } from '../../../Category/model/category.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-marketplace-list',
  templateUrl: './marketplace-list.component.html',
  styleUrls: ['./marketplace-list.component.css']
})
export class MarketplaceListComponent implements OnInit {
  skills: Skill[] = [];
  categories: Category[] = [];
  selectedCategory: string = '';
  searchText: string = '';
  allSkills: Skill[] = []; // Pour stocker toutes les compétences
  /* colors = [
    '#FF6F61', // Etsy / Letgo
    '#007BFF', // Amazon / Blue
    '#00C853', // OfferUp Green
    '#FFC107', // DHGate Yellow
    '#8E24AA', // Marketplace Purple
    '#FF3D00', // eBay Red
    '#2962FF', // eBay Blue
    '#43A047', // Wish Green
    '#E91E63', // Bold pink
  ];
  getRandomColor(index: number): string {
    return this.colors[index % this.colors.length];
  }
  */
  constructor(
    private router: Router,
    private marketplaceService: MarketplaceService
  ) {}
  
  
  ngOnInit(): void {
    this.loadSkills();
    
    this.marketplaceService.getAllCategory().subscribe((data) => {
      this.categories = data;
    });
  }
  
  loadSkills(): void {
    this.marketplaceService.getAllSkills().subscribe((data) => {
      this.skills = data;
      this.allSkills = data; // Sauvegarde de toutes les compétences
    });
  }
  
  searchSkills(): void {
    console.log('Recherche avec:', { 
      categorie: this.selectedCategory, 
      texte: this.searchText 
    });

    if (!this.selectedCategory && !this.searchText) {
      console.log('Aucun filtre appliqué, affichage de toutes les compétences');
      this.skills = this.allSkills;
      return;
    }
    
    if (this.selectedCategory && !this.searchText) {
      console.log('Recherche par catégorie uniquement:', this.selectedCategory);
      this.marketplaceService.getSkillsByCategory(this.selectedCategory).subscribe({
        next: (data) => {
          console.log('Résultats de la recherche par catégorie:', data);
          this.skills = data;
        },
        error: (err) => {
          console.error('Erreur lors de la recherche par catégorie:', err);
          // En cas d'erreur, on filtre localement
          this.filterSkillsLocally();
        }
      });
      return;
    }
    
    // Si on a du texte ou les deux filtres, on filtre localement
    this.filterSkillsLocally();
  }

  // Nouvelle méthode pour filtrer localement
  private filterSkillsLocally(): void {
    console.log('Filtrage local des compétences');
    this.skills = this.allSkills.filter(skill => {
      const matchesCategory = !this.selectedCategory || 
                             (skill.category && skill.category.name === this.selectedCategory);
      const matchesText = !this.searchText || 
                         skill.name.toLowerCase().includes(this.searchText.toLowerCase());
      
      return matchesCategory && matchesText;
    });
    console.log('Résultats du filtrage local:', this.skills);
  }
  onViewDetail(skill: any) {
    this.router.navigate(['MarketplaceDetail', skill._id]);
  }
  addskill()
{
this.router.navigate(['skill/add']);  
}
  onEditSkill(skill: any) {
    console.log('Édition du skill:', skill);
    this.marketplaceService.setSelectedSkill(skill);
    this.router.navigate(['/upd-skil', skill._id]);
  }
  
  onDeleteSkill(skill: any) {
    if (confirm(`Supprimer la compétence "${skill.name}" ?`)) {
      this.router.navigate(['DelSkill', skill._id]);
    }
  }

  goToSalon(skill: any) {
    // Récupérer le nom de la compétence et le nom du tuteur
    const skillName = skill.name || '';
    
    // Récupérer le nom du tuteur (utilisateur)
    let tutorName = '';
    if (typeof skill.user === 'object' && skill.user.name) {
      tutorName = skill.user.name;
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

  goToSession(skill: any) {
    this.router.navigate(['sessions/list', skill._id]);
  }
   

  getUserInfo(skill: Skill): string {
    console.log('Skill user data:', skill.user); // Ajout de log pour déboguer
    
    // Vérifier si user existe
    if (!skill.user) {
      return 'Non défini (user manquant)';
    }
    
    // Si l'utilisateur est déjà un objet avec un nom
    if (typeof skill.user === 'object' && skill.user.name) {
      console.log('User object with name:', skill.user.name);
      return skill.user.name;
    }
    
    // Si l'utilisateur est juste un ID
    const userId = typeof skill.user === 'object' ? skill.user._id : skill.user;
    console.log('Extracted userId:', userId);
    
    if (userId) {
      // Chargez l'utilisateur en arrière-plan
      this.marketplaceService.getUserById(String(userId)).subscribe({
        next: (user) => {
          console.log('API response for user:', user);
          if (user && user.name) {
            console.log('User name found:', user.name);
            // Mettez à jour l'objet skill avec les informations de l'utilisateur
            if (typeof skill.user === 'object') {
              skill.user.name = user.name;
            } else {
              skill.user = user;
            }
          } else {
            console.log('User found but no name property:', user);
          }
        },
        error: (err) => {
          console.error('Error fetching user:', err);
        }
      });
      
      // Retournez un message temporaire pendant le chargement
      return 'Chargement...';
    }
    
    return 'Non défini (userId manquant)';
  }
}

