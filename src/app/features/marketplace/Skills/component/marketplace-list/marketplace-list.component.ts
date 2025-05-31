import { Component, OnInit } from '@angular/core';
import { MarketplaceService } from '../../services/marketplace.service';
import { Skill } from '../../model/skill.model';
import { Category } from '../../../Category/model/category.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Component({
  selector: 'app-marketplace-list',
  templateUrl: './marketplace-list.component.html',
  styleUrls: ['./marketplace-list.component.css'],
})
export class MarketplaceListComponent implements OnInit {
  skills: Skill[] = [];
  categories: Category[] = [];
  selectedCategory: string = '';
  searchText: string = '';
  allSkills: Skill[] = []; // Pour stocker toutes les compétences
  validationResults: {
    [skillId: string]: { skill: string; isValid: boolean; username: string };
  } = {};
  isValidating: { [skillId: string]: boolean } = {};
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
    private marketplaceService: MarketplaceService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadSkills();

    this.marketplaceService.getAllCategory().subscribe((data) => {
      this.categories = data;
    });
  }

  loadSkills(): void {
    this.marketplaceService.getAllSkills().subscribe((data) => {
      console.log('📊 Skills data loaded:', data);
      console.log('📊 First skill example:', data[0]);
      if (data[0]?.user) {
        console.log('📊 First skill user data:', data[0].user);
        console.log('📊 User type:', typeof data[0].user);
      }
      this.skills = data;
      this.allSkills = data; // Sauvegarde de toutes les compétences
    });
  }

  searchSkills(): void {
    console.log('Recherche avec:', {
      categorie: this.selectedCategory,
      texte: this.searchText,
    });

    if (!this.selectedCategory && !this.searchText) {
      console.log('Aucun filtre appliqué, affichage de toutes les compétences');
      this.skills = this.allSkills;
      return;
    }

    if (this.selectedCategory && !this.searchText) {
      console.log('Recherche par catégorie uniquement:', this.selectedCategory);
      this.marketplaceService
        .getSkillsByCategory(this.selectedCategory)
        .subscribe({
          next: (data) => {
            console.log('Résultats de la recherche par catégorie:', data);
            this.skills = data;
          },
          error: (err) => {
            console.error('Erreur lors de la recherche par catégorie:', err);
            // En cas d'erreur, on filtre localement
            this.filterSkillsLocally();
          },
        });
      return;
    }

    // Si on a du texte ou les deux filtres, on filtre localement
    this.filterSkillsLocally();
  }

  // Nouvelle méthode pour filtrer localement
  private filterSkillsLocally(): void {
    console.log('Filtrage local des compétences');
    this.skills = this.allSkills.filter((skill) => {
      const matchesCategory =
        !this.selectedCategory ||
        (skill.category && skill.category.name === this.selectedCategory);
      const matchesText =
        !this.searchText ||
        skill.name.toLowerCase().includes(this.searchText.toLowerCase());

      return matchesCategory && matchesText;
    });
    console.log('Résultats du filtrage local:', this.skills);
  }
  onViewDetail(skill: any) {
    this.router.navigate(['MarketplaceDetail', skill._id]);
  }
  addskill() {
    this.router.navigate(['skill/add']);
  }
  onEditSkill(skill: any) {
    console.log('Édition du skill:', skill);
    this.marketplaceService.setSelectedSkill(skill);
    this.router.navigate(['/upd-skil', skill._id]);
  }

  onDeleteSkill(skill: any) {
    if (confirm(`Supprimer la compétence "${skill.name}" ?`)) {
      this.marketplaceService.deleteSkill(skill._id).subscribe({
        next: () => {
          // Recharger la liste des compétences ou supprimer localement
          this.loadSkills(); // si tu as une méthode pour recharger
          // ou bien, si tu utilises un tableau local :
          // this.skills = this.skills.filter(s => s._id !== skill._id);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression :', error);
        },
      });
    }
  }

  goToSalon(skill: any) {
    // Récupérer le nom de la compétence et le nom du tuteur
    const skillName = skill.name || '';

    // Récupérer le nom du tuteur (utilisateur)
    let tutorName = '';
    if (typeof skill.user === 'object' && skill.user.fullName) {
      tutorName = skill.user.fullName;
    }

    console.log(
      `Recherche de salons pour la compétence "${skillName}" et le tuteur "${tutorName}"`
    );

    // Naviguer vers la liste des salons avec les paramètres de recherche
    this.router.navigate(['/salons/list'], {
      queryParams: {
        skillName: skillName,
        tutorName: tutorName,
      },
    });
  }

  goToSession(skill: any) {
    // Envoie le nom du skill en query param "skillName"
    this.router.navigate(['sessions/list'], {
      queryParams: { skillName: skill.name },
    });
  }

  // Méthode pour afficher le nom utilisateur dans la liste
  getUserInfo(skill: Skill): string {
    if (!skill.user) {
      return 'Non défini (user manquant)';
    }

    if (typeof skill.user === 'object') {
      return skill.user.fullName || 'Nom utilisateur non disponible';
    }

    return `Utilisateur ID: ${skill.user}`;
  }

  // Add this test method to debug the HTTP call
  testApiCall(): void {
    console.log('🧪 Testing direct API call with hardcoded values');

    const testUsername = 'Manel1804';
    const testSkill = 'javascript';

    this.marketplaceService
      .checkGitHubSkill(testUsername, testSkill)
      .subscribe({
        next: (response) => {
          console.log('🎉 Test API call successful!', response);
          alert(`Test successful! Response: ${JSON.stringify(response)}`);
        },
        error: (error) => {
          console.error('💥 Test API call failed!', error);
          alert(`Test failed! Error: ${error.message}`);
        },
      });
  }

  validateGitHubSkill(skill: any): void {
    console.log('=== Starting GitHub Skill Validation ===');
    console.log('Skill object:', skill);

    if (!skill._id) {
      console.error('❌ Skill has no _id:', skill);
      alert('❌ Erreur: Compétence sans identifiant.');
      return;
    }

    this.isValidating[skill._id] = true;

    // Si user est un ID ou pas chargé, on essaie de récupérer l'objet user complet via API
    if (!skill.user || typeof skill.user === 'string') {
      const userId = typeof skill.user === 'string' ? skill.user : null;
      console.log('User is an ID, fetching user data for userId:', userId);

      if (!userId) {
        console.error('❌ No user ID found in skill object');
        this.isValidating[skill._id] = false;
        alert('❌ Données utilisateur manquantes.');
        return;
      }

      // Charger user complet depuis API
      this.marketplaceService.getUserById(userId).subscribe({
        next: (user) => {
          console.log('User data fetched:', user);

          if (!user.github || !user.github.username) {
            console.error('❌ No GitHub username found for user:', user);
            this.isValidating[skill._id] = false;
            alert(
              "❌ Aucun nom d'utilisateur GitHub trouvé pour cet utilisateur. L'utilisateur doit configurer son GitHub dans son profil."
            );
            return;
          }

          console.log('GitHub username found:', user.github.username);
          this.checkSkillWithGitHub(
            user.github.username,
            skill.name,
            skill._id
          );
        },
        error: (error) => {
          console.error('❌ Error fetching user data:', error);
          this.isValidating[skill._id] = false;
          alert('❌ Impossible de récupérer les infos utilisateur.');
        },
      });
      return;
    }

    // Si user complet est déjà présent
    console.log('User object is already complete:', skill.user);
    const username = skill.user.github?.username;

    if (!username) {
      console.error('❌ No GitHub username in user object:', skill.user);
      this.isValidating[skill._id] = false;
      alert(
        "❌ Aucun nom d'utilisateur GitHub trouvé pour cet utilisateur. L'utilisateur doit configurer son GitHub dans son profil."
      );
      return;
    }

    console.log('GitHub username found in user object:', username);
    this.checkSkillWithGitHub(username, skill.name, skill._id);
  }

  // Méthode pour faire la vérification auprès du backend
  private checkSkillWithGitHub(
    username: string,
    skillName: string,
    skillId: string
  ): void {
    console.log(`=== Calling GitHub API ===`);
    console.log(`Username: ${username}`);
    console.log(`Skill: ${skillName}`);
    console.log(
      `API URL: http://localhost:3000/api/skill-market/check-skill?username=${username}&skill=${skillName}`
    );

    this.marketplaceService
      .checkGitHubSkill(username, skillName)
      .pipe(
        catchError((err) => {
          console.error('❌ API Error:', err);
          console.error('Error details:', {
            status: err.status,
            message: err.message,
            error: err.error,
          });
          this.isValidating[skillId] = false;
          alert('❌ Une erreur est survenue lors de la validation.');
          return of(null);
        })
      )
      .subscribe((response: { skill: string; isValid: boolean } | null) => {
        console.log('=== API Response Received ===');
        console.log('Response:', response);

        this.isValidating[skillId] = false;

        if (response) {
          // Store the result for display in UI
          this.validationResults[skillId] = {
            skill: response.skill,
            isValid: response.isValid,
            username: username,
          };

          console.log(
            'Validation result stored:',
            this.validationResults[skillId]
          );

          if (response.isValid) {
            const message = `✅ La compétence "${response.skill}" a été validée avec succès sur GitHub pour l'utilisateur ${username}.`;
            console.log(message);
            alert(message);
          } else {
            const message = `❌ La compétence "${response.skill}" n'a pas été trouvée dans les dépôts GitHub de l'utilisateur ${username}.`;
            console.log(message);
            alert(message);
          }
        } else {
          console.error('❌ No response received from API');
        }
      });
  }

  // Helper method to get validation result for display
  getValidationResult(
    skillId: string
  ): { skill: string; isValid: boolean; username: string } | null {
    return this.validationResults[skillId] || null;
  }

  // Helper method to check if validation is in progress
  isValidatingSkill(skillId: string): boolean {
    return this.isValidating[skillId] || false;
  }
}
