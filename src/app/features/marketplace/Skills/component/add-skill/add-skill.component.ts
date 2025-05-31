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
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        this.currentUserId = user._id || user.id || user.userId || '';
      } catch (e) {
        console.error('Erreur de parsing du user depuis localStorage:', e);
      }
    }

    // Formulaire avec champ GitHub Username
    this.skillForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      githubUsername: ['', [Validators.required, Validators.minLength(2)]],
    });

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

      const now = new Date();

      const skill: Skill = {
        name: formValues.name,
        description: formValues.description,
        category: selectedCategory,
        user: this.currentUserId,
        github: {
          username: formValues.githubUsername,
          validatedSkills: [], // vide par défaut
          lastUpdated: now,
        },
      };

      this.skillService.addSkill(skill).subscribe({
        next: () => {
          alert('Skill ajouté avec succès!');
          this.router.navigate(['/MarketplaceList']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erreur lors de l\'ajout du skill :', err);
          alert(`Erreur: ${err.error?.error || err.message}`);
        },
      });
    } else {
      alert(
        !this.currentUserId
          ? 'Erreur: ID utilisateur manquant.'
          : 'Formulaire invalide. Vérifiez les champs.'
      );
    }
  }
}
