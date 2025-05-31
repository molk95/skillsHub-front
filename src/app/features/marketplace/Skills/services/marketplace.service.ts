import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Skill } from '../model/skill.model';
import { Category } from '../../Category/model/category.model';

@Injectable({
  providedIn: 'root',
})
export class MarketplaceService {
  private apiUrl = 'http://localhost:3000/api/skill-market';
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
    return this.http.get<Skill[]>('http://localhost:3000/api/skill-market');
  }

  getAllCategory(): Observable<Category[]> {
    return this.http.get<Category[]>('http://localhost:3000/api/Category/all');
  }

  getSkillsByCategory(category: string): Observable<Skill[]> {
    console.log(`Recherche par catégorie: ${category}`);
    return this.http.get<Skill[]>(
      `${this.apiUrl}/marketplace/category/${category}`
    );
  }
  getUserById(userId: string): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/api/users/${userId}`);
  }

  getSkillById(id: string): Observable<Skill> {
    console.log(`Appel API pour récupérer le skill: ${this.apiUrl}/${id}`);
    return this.http.get<Skill>(`${this.apiUrl}/skills/${id}`);
  }

  updateSkill(id: string, skill: any): Observable<any> {
    // L'URL correcte basée sur la structure observée dans les autres méthodes
    const url = `${this.apiUrl}/updateSkill/${id}`;

    console.log(`Tentative de mise à jour avec l'URL: ${url}`);
    console.log('Données envoyées:', skill);

    return this.http.put(url, skill).pipe(
      tap((response) => console.log('Réponse de mise à jour:', response)),
      catchError((error) => {
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
    return this.http.delete<void>(
      `http://localhost:3000/api/skill-market/deleteSkill/${id}`
    );
  }

  // nouvelle méthodes pour le matching
  findMatchingSkills(userId: string): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/matchSkills/${userId}`, {
        params: { userId },
      })
      .pipe(
        tap((response) =>
          console.log('Réponse du matching de compétences:', response)
        ),
        catchError((error) => {
          console.error('Erreur lors du matching de compétences:', error);
          return throwError(() => error);
        })
      );
  }

  checkGitHubSkill(username: string, skill: string) {
    const url = `http://localhost:3000/api/skill-market/check-skill`;
    const params = { username, skill };

    console.log('🔍 Making HTTP request to GitHub skill validation endpoint');
    console.log('URL:', url);
    console.log('Params:', params);
    console.log(
      'Full URL with params:',
      `${url}?username=${username}&skill=${skill}`
    );

    return this.http
      .get<{ skill: string; isValid: boolean }>(url, { params })
      .pipe(
        tap((response) => {
          console.log('✅ HTTP Response received:', response);
          console.log('Response type:', typeof response);
          console.log('Response keys:', Object.keys(response || {}));
        }),
        catchError((error) => {
          console.error('❌ HTTP Error occurred:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          console.error('Error body:', error.error);
          return throwError(() => error);
        })
      );
  }

  // http://localhost:3000/api/skill-market/check-skill?username=Manel1804&skill=javascript

  suggestSkills(userId: string): Observable<any> {
    return this.http
      .get(`http://localhost:3000/api/skills/matching/suggest/${userId}`)
      .pipe(
        tap((response) => console.log('Suggestions de compétences:', response)),
        catchError((error) => {
          console.error('Erreur lors de la suggestion de compétences:', error);
          return throwError(() => error);
        })
      );
  }
}
