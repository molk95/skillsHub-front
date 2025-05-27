import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Category } from '../../../Category/model/category.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../Category/services/category.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-upd-cat',
  templateUrl: './upd-cat.component.html',
  styleUrls: ['./upd-cat.component.css']
})
export class UpdCatComponent implements OnInit {
  categoryForm!: FormGroup;
  category: Category[] = [];
  categoryId!: string;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupère l'ID de la catégorie depuis l'URL
    this.categoryId = this.route.snapshot.paramMap.get('id')!;
    console.log('ID de la catégorie à modifier:', this.categoryId);

    // Initialise le formulaire avec uniquement name et description
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
    
    // Charge les données de la catégorie
    this.loadCategoryData();
  }

  private loadCategoryData(): void {
    // Essaie d'abord de récupérer le Category depuis le service
    const selectedCategory = this.categoryService.getSelectedCategory();
    if (selectedCategory && selectedCategory._id === this.categoryId) {
      console.log('Category récupéré depuis le service:', selectedCategory);
      this.populateForm(selectedCategory);
    } else {
      // Si la catégorie n'est pas disponible dans le service, le récupérer via l'API
      this.loadCategoryFromApi();
    }
  }

  private populateForm(category: Category): void {
    // Version simplifiée avec uniquement name et description
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description
    });
  }

  private loadCategoryFromApi(): void {
    this.categoryService.getCategoryById(this.categoryId).subscribe({
      next: (category: Category) => {
        console.log('Category récupéré pour modification via API:', category);
        this.populateForm(category);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur lors du chargement de la catégorie', error);
      }
    });
  }

  updateCategory(): void {
    if (this.categoryForm.valid) {
      const formValues = this.categoryForm.value;
      
      // Utiliser uniquement les champs name et description
      const updatedFields = {
        name: formValues.name,
        description: formValues.description
      };
      
      console.log('Données à envoyer pour la mise à jour:', updatedFields);
      
      this.categoryService.updateCategory(this.categoryId, updatedFields).subscribe({
        next: (response) => {
          console.log('Réponse de mise à jour:', response);
          alert('Catégorie mise à jour avec succès!');
          this.router.navigate(['/CategoryList']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erreur lors de la mise à jour de la catégorie:', err);
          alert(`Erreur lors de la mise à jour: ${err.message}`);
        }
      });
    } else {
      alert('Formulaire invalide. Veuillez corriger les champs.');
    }
  }
}


