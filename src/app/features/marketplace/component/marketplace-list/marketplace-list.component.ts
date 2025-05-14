import { Component, OnInit } from '@angular/core';
import { MarketplaceService } from '../../services/marketplace.service'
import { Skill } from '../../models/skill.model';
import { Category } from '../../models/category.model';
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
    private marketplaceService: MarketplaceService, 
    private router: Router
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
  getUserInfo(skill: Skill): string {
    // Vérifier d'abord users (au pluriel)
    if (skill.users && Array.isArray(skill.users) && skill.users.length > 0) {
      const firstUser = skill.users[0];
      if (typeof firstUser === 'object') {
        return firstUser.name || firstUser._id || 'ID non disponible';
      }
      return String(firstUser);
    }
    
    // Fallback sur user (au singulier)
    if (skill.user) {
      if (typeof skill.user === 'object') {
        return skill.user.name || skill.user._id || 'ID non disponible';
      }
      return String(skill.user);
    }
    
    return 'Non défini';
  }
}

