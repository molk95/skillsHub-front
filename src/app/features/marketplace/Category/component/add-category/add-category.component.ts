import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Category } from '../../model/category.model';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../auth/services/auth.service';
@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {
  categoryForm!: FormGroup;
  currentUserId: string = '';
  categoryId: string = '';

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Récupérer l'ID de l'utilisateur connecté directement dans le composant
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.currentUserId = user.id || '';
    
    // Récupérer l'ID de la catégorie depuis l'URL si disponible
    this.categoryId = this.route.snapshot.paramMap.get('id') || '';
    
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
    });

    // Si un ID de catégorie est fourni, charger les données de cette catégorie
    if (this.categoryId) {
      this.loadCategoryData();
    }
  }
  
  private loadCategoryData(): void {
    this.categoryService.getCategoryById(this.categoryId).subscribe({
      next: (category: Category) => {
        console.log('Catégorie récupérée:', category);
        this.categoryForm.patchValue({
          name: category.name,
          description: category.description
        });
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur lors du chargement de la catégorie', error);
      }
    });
  }
        
  addCategory() {
    if (this.categoryForm.valid) {
      // Créer l'objet category avec les valeurs du formulaire
      const category: Category = {
        ...this.categoryForm.value,
        userId: this.currentUserId // Ajouter l'ID de l'utilisateur connecté
      };
      
      this.categoryService.addCategory(category).subscribe({
        next: () => {
          alert('Category ajouté avec succès!');
          this.router.navigate(['/CategoryList']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erreur lors de l\'ajout de category :', {
            status: err.status,
            message: err.message,
            error: err.error
          });
        }
      });
    } else {
      alert('Formulaire invalide. Veuillez vérifier les champs.');
    }
  }
}

