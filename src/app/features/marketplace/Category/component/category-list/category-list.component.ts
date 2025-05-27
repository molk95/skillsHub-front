import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../model/category.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  searchText: string = '';
  
  constructor(
    private router: Router,
    private categoryService: CategoryService
  ) {}
  
  ngOnInit(): void {
    this.loadCategories();
  }
  
  loadCategories(): void {
    this.categoryService.getAllCategory().subscribe({
      next: (data) => {
        console.log('Catégories récupérées:', data);
        this.categories = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des catégories:', err);
      }
    });
  }
  
  searchCategories(): void {
    if (!this.searchText) {
      this.loadCategories();
      return;
    }
    
    // Filtrage local des catégories par nom
    this.categories = this.categories.filter(category => 
      category.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      category.description.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
  
  onViewDetail(category: Category): void {
    // Navigation vers les détails de la catégorie
    this.router.navigate(['/CategoryDetail', category._id]);
  }
  
  addCategory(): void {
    this.router.navigate(['/AddCategory']);
  }
  
  onEditCategory(category: Category): void {
    console.log('Édition de la catégorie:', category);
    this.categoryService.setSelectedCategory(category);
    this.router.navigate(['/UpdateCategory', category._id]);
  }
  
  onDeleteCategory(category: Category): void {
    if (confirm(`Supprimer la catégorie "${category.name}" ?`)) {
      this.categoryService.deleteCategory(category._id!).subscribe({
        next: () => {
          console.log('Catégorie supprimée avec succès');
          // Recharger la liste après suppression
          this.loadCategories();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
        }
      });
    }
  }
}


