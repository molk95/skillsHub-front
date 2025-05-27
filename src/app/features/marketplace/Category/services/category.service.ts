import { Injectable } from '@angular/core';
import { Category } from '../model/category.model';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
private apiUrl = 'http://localhost:3000/api/Category';
  private selectedCategory: Category | null = null;

  constructor(private http: HttpClient) {}
    getAllCategory(): Observable<Category[]> {
      return this.http.get<Category[]>(this.apiUrl+'/all');
    }
    
    

  // Méthodes de gestion du category sélectionné (déplacées depuis categoryDataService)
  setSelectedCategory(category: Category): void {
    this.selectedCategory = category;
  }

  getSelectedCategory(): Category | null {
    return this.selectedCategory;
  }

  clearSelectedCategory(): void {
    this.selectedCategory = null;
  }

  
  getUserById(userId: string): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/api/users/${userId}`);
  }

  getCategoryById(id: string): Observable<Category> {
    const url = `${this.apiUrl}/${id}`;
    console.log(`Appel API pour récupérer le Category: ${url}`);
    return this.http.get<Category>(url);
  }
    
  updateCategory(id: string, category: any): Observable<any> {
    // L'URL correcte basée sur la structure de l'API backend
    const url = `${this.apiUrl}/${id}`;
    console.log('URL utilisée pour la mise à jour:', url);
    
    return this.http.put<any>(url, category).pipe(
      tap(response => console.log('Réponse de mise à jour:', response)),
      catchError(error => {
        console.error('Erreur lors de la mise à jour:', error);
        console.error('URL utilisée:', url);
        return throwError(() => error);
      })
    );
  }

  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl+'/create', category);
      }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


 
}





