import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarketplaceService } from '../../services/marketplace.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Skill, User } from '../../model/skill.model';
import { Category } from '../../../Category/model/category.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-upd-skil',
  templateUrl: './upd-skil.component.html',
  styleUrls: ['./upd-skil.component.css']
})
export class UpdSkilComponent implements OnInit {
  skillForm!: FormGroup;
  categories: Category[] = [];
  skillId!: string;

  constructor(
    private fb: FormBuilder,
    private skillService: MarketplaceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.skillId = this.route.snapshot.paramMap.get('id')!;
    console.log('ID du skill à modifier:', this.skillId);

    this.skillForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      gituser: [''],  // Pour le username GitHub (optionnel)
    });

    // Charger les catégories puis charger le skill à éditer
    this.skillService.getAllCategory().subscribe({
      next: (data) => {
        this.categories = data;
        console.log('Catégories chargées:', this.categories);
        this.loadSkillData();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories', error);
      }
    });
  }

  // Charge les données du skill à modifier
  loadSkillData(): void {
    this.skillService.getSkillById(this.skillId).subscribe({
      next: (skill: Skill) => {
        console.log('Skill récupéré pour modification via API:', skill);
        this.populateForm(skill);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur lors du chargement du skill', error);
        alert('Impossible de charger les données du skill.');
      }
    });
  }

  // Remplit le formulaire avec les données récupérées
  populateForm(skill: Skill): void {
    // Extraction du nom de la catégorie (string) ou objet Category
    let categoryValue = '';
    if (skill.category) {
      categoryValue = typeof skill.category === 'object' ? skill.category.name : skill.category;
    }

    // Extraction du username GitHub s’il existe
    const gitUsername = skill.github?.username || '';

    this.skillForm.patchValue({
      name: skill.name,
      description: skill.description,
      category: categoryValue,
      gituser: gitUsername,
    });
  }

  // Soumission du formulaire de mise à jour
  updateSkill(): void {
    if (this.skillForm.valid) {
      const formValues = this.skillForm.value;

      // Trouver l'objet Category complet depuis le nom sélectionné
      const selectedCategory = this.categories.find(cat => cat.name === formValues.category);

      if (!selectedCategory) {
        alert('Catégorie non trouvée. Veuillez sélectionner une catégorie valide.');
        return;
      }

      // Préparer l'objet à envoyer pour la mise à jour
      const updatedFields: any = {
        name: formValues.name,
        description: formValues.description,
        category: selectedCategory,
      };

      if (formValues.gituser) {
        updatedFields.github = {
          username: formValues.gituser,
          validatedSkills: [],  // Optionnel, à adapter selon ton besoin
          lastUpdated: new Date(),
        };
      }

      this.skillService.updateSkill(this.skillId, updatedFields).subscribe({
        next: (response) => {
          alert('Skill mis à jour avec succès !');
          this.router.navigate(['/MarketplaceList']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erreur lors de la mise à jour du skill :', err);
          alert(`Erreur lors de la mise à jour : ${err.message}`);
        }
      });
    } else {
      alert('Formulaire invalide. Veuillez corriger les champs.');
    }
  }
}

/*



import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarketplaceService } from '../../services/marketplace.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Skill } from '../../model/skill.model';
import { Category } from '../../../Category/model/category.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-upd-skil',
  templateUrl: './upd-skil.component.html',
  styleUrls: ['./upd-skil.component.css']
})
export class UpdSkilComponent implements OnInit {
  skillForm!: FormGroup;
  categories: Category[] = [];
  skillId!: string;

  constructor(
    private fb: FormBuilder,
    private skillService: MarketplaceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
 


  ngOnInit(): void {
    // Récupère l'ID du skill depuis l'URL
    this.skillId = this.route.snapshot.paramMap.get('id')!;
    console.log('ID du skill à modifier:', this.skillId);

    // Initialise le formulaire
    this.skillForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
    });

    // Charge les catégories d'abord
    this.skillService.getAllCategory().subscribe({
      next: (data) => {
        this.categories = data;
        console.log('Catégories chargées:', this.categories);
        
        // Une fois les catégories chargées, on charge le skill
        this.loadSkillData();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories', error);
      }
    });
  }

  private loadSkillData(): void {
    // Essaie d'abord de récupérer le skill depuis le service
    const selectedSkill = this.skillService.getSelectedSkill();
    if (selectedSkill && selectedSkill._id === this.skillId) {
      console.log('Skill récupéré depuis le service:', selectedSkill);
      this.populateForm(selectedSkill);
    } else {
      // Si le skill n'est pas disponible dans le service, le récupérer via l'API
      this.loadSkillFromApi();
    }
  }

  private populateForm(skill: Skill): void {
    console.log('Tentative d\'extraction de l\'ID utilisateur');
    
    // Gérer le cas où category est null
    let categoryValue = '';
    if (skill.category) {
      categoryValue = typeof skill.category === 'object' ? skill.category.name : skill.category;
    }
    
    // Vérifier si users existe (au pluriel)
    let userId = '';
    if (skill.users && Array.isArray(skill.users) && skill.users.length > 0) {
      // Prendre le premier utilisateur si c'est un tableau
      const firstUser = skill.users[0];
      userId = typeof firstUser === 'object' ? firstUser._id || firstUser.id || '' : firstUser;
    } else if (skill.userId) {
      // Utiliser user si disponible
      userId = typeof skill.userId === 'object' ? skill.userId._id || skill.userId.id || '' : skill.userId;
    }
    
    this.skillForm.patchValue({
      name: skill.name,
      description: skill.description,
      category: categoryValue,
      userId: userId,
      gituser: skill.github?.username || ''
    });
  }

  private loadSkillFromApi(): void {
    this.skillService.getSkillById(this.skillId).subscribe({
      next: (skill: Skill) => {
        console.log('Skill récupéré pour modification via API:', skill);
        console.log('Structure détaillée de l\'utilisateur:', {
          user: skill.userId,
          typeofUser: typeof skill.userId,
          userKeys: skill.userId ? Object.keys(skill.userId) : [],
          userStringified: JSON.stringify(skill.userId, null, 2)
        });
        this.populateForm(skill);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur lors du chargement du skill', error);
      }
    });
  }

  updateSkill(): void {
    if (this.skillForm.valid) {
      const formValues = this.skillForm.value;
      
      // Utiliser any pour éviter les erreurs de typage
      const updatedFields: any = {
        name: formValues.name,
        description: formValues.description,
        category: formValues.category
      };
      
      if (formValues.gituser) {
        updatedFields.github = {
          username: formValues.gituser
        };
      }
      
      console.log('Données à envoyer pour la mise à jour:', updatedFields);
      
      this.skillService.updateSkill(this.skillId, updatedFields).subscribe({
        next: (response) => {
          console.log('Réponse de mise à jour:', response);
          alert('Skill mis à jour avec succès!');
          this.router.navigate(['/MarketplaceList']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erreur lors de la mise à jour du skill :', err);
          alert(`Erreur lors de la mise à jour: ${err.message}`);
        }
      });
    } else {
      alert('Formulaire invalide. Veuillez corriger les champs.');
    }
  }
}
*/
































