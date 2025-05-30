import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarketplaceService } from '../../services/marketplace.service';
import { Router } from '@angular/router';
import { Skill } from '../../model/skill.model';
import { Category } from '../../../Category/model/category.model';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../auth/services/auth.service';

@Component({
  selector: 'app-add-skill',
  templateUrl: './add-skill.component.html',
  styleUrls: ['./add-skill.component.css'],
})
export class AddSkillComponent implements OnInit {
  skillForm!: FormGroup;
  categories: Category[] = [];
  currentUserId: string = '';

  constructor(
    private fb: FormBuilder,
    private skillService: MarketplaceService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Récupère l'utilisateur depuis le localStorage
    const userString = localStorage.getItem('user');
    console.log('User localStorage:', localStorage.getItem('user'));
    if (userString) {
      try {
        const user = JSON.parse(userString);
        // Vérifie les propriétés possibles pour l'identifiant
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

    // Initialise le formulaire
    this.skillForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
    });

    // Charge les catégories
    this.skillService.getAllCategory().subscribe({
      next: (data) => (this.categories = data),
      error: (err) => console.error('Erreur chargement catégories', err),
    });
  }

  addSkill() {
    if (this.skillForm.valid && this.currentUserId) {
      const formValues = this.skillForm.value;
      const selectedCategory = this.categories.find(
        (cat) => cat._id === formValues.category
      );

      if (!selectedCategory) {
        alert('Catégorie non valide');
        return;
      }

      const skill: Skill = {
        name: formValues.name,
        description: formValues.description,
        category: selectedCategory,
        user: this.currentUserId,
      };

      this.skillService.addSkill(skill).subscribe({
        next: () => {
          alert('Skill ajouté avec succès!');
          this.router.navigate(['/MarketplaceList']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erreur lors de l\'ajout du skill :', err);
          alert(
            `Erreur lors de l'ajout du skill: ${
              err.error?.error || err.message
            }`
          );
        },
      });
    } else {
      if (!this.currentUserId) {
        alert('Erreur: ID utilisateur manquant. Veuillez vous reconnecter.');
      } else {
        alert('Formulaire invalide. Veuillez vérifier les champs.');
      }
    }
  }
}


  /*
  ngOnInit() {
    // Récupérer l'ID de l'utilisateur connecté directement dans le composant
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.currentUserId = user.id || '';

    // Vérifier si l'ID utilisateur est valide
    if (!this.currentUserId) {
      console.error('ID utilisateur non valide ou manquant');
      // Rediriger vers la page de connexion si nécessaire
      // this.router.navigate(['/login']);
      // return;
    }

    this.skillForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      // Suppression du champ userId du formulaire car il sera défini automatiquement
    });

    this.skillService.getAllCategory().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des catégories', error);
      }
    );
  }

  addSkill() {
    if (this.skillForm.valid && this.currentUserId) {
      // Créer l'objet skill avec les valeurs du formulaire
      const formValues = this.skillForm.value;

      // Trouver l'ID de la catégorie sélectionnée
      const selectedCategory = this.categories.find(
        (cat) => cat.name === formValues.category
      );

      if (!selectedCategory) {
        alert(
          'Catégorie non trouvée. Veuillez sélectionner une catégorie valide.'
        );
        return;
      }

      const skill: Skill = {
        name: formValues.name,
        description: formValues.description,
        category: selectedCategory, // Pass the full category object instead of just the ID
        user: this.currentUserId, // Changed from userId to user based on the lint error
      };

      this.skillService.addSkill(skill).subscribe({
        next: () => {
          alert('Skill ajouté avec succès!');
          this.router.navigate(['/MarketplaceList']);
        },
        error: (err: HttpErrorResponse) => {
          console.error("Erreur lors de l'ajout du skill :", err);
          alert(
            `Erreur lors de l'ajout du skill: ${
              err.error?.error || err.message
            }`
          );
        },
      });
    } else {
      if (!this.currentUserId) {
        alert('Erreur: ID utilisateur manquant. Veuillez vous reconnecter.');
      } else {
        alert('Formulaire invalide. Veuillez vérifier les champs.');
      }
    }
  }
}
  */