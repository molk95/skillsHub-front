import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Skill } from '../models/skill.model';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {
  private apiUrl = 'http://localhost:3000/api/marketplace';
  private selectedSkill: Skill | null = null;

  constructor(private http: HttpClient) {}

  // Méthodes de gestion du skill sélectionné (déplacées depuis SkillDataService)
  setSelectedSkill(skill: Skill): void {
    this.selectedSkill = skill;
  }

  getSelectedSkill(): Skill | null {
    return this.selectedSkill;
  }

  clearSelectedSkill(): void {
    this.selectedSkill = null;
  }

  // Méthodes API existantes
  getAllSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>(this.apiUrl);
  }

  getAllCategory(): Observable<Category[]> {
    return this.http.get<Category[]>('http://localhost:3000/api/Category/all/');
  }

  getSkillsByCategory(category: string): Observable<Skill[]> {
    console.log(`Recherche par catégorie: ${category}`);
    return this.http.get<Skill[]>(`${this.apiUrl}/marketplace/category/${category}`);
  }

  getSkillById(id: string): Observable<Skill> {
    console.log(`Appel API pour récupérer le skill: ${this.apiUrl}/${id}`);
    return this.http.get<Skill>(`${this.apiUrl}/skills/${id}`);
  }
    
  updateSkill(id: string, skill: any): Observable<any> {
    const url = `${this.apiUrl}/updateSkill/${id}`;
    console.log(`Tentative de mise à jour avec l'URL: ${url}`);
    console.log('Données envoyées:', skill);
    
    return this.http.put(url, skill).pipe(
      tap(response => console.log('Réponse de mise à jour:', response)),
      catchError(error => {
        console.error('Erreur lors de la mise à jour:', error);
        console.error('URL utilisée:', url);
        return throwError(() => error);
      })
    );
  }

  addSkill(skill: Skill): Observable<Skill> {
    return this.http.post<Skill>(this.apiUrl, skill);
  }

  deleteSkill(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}









