import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Challenge } from '../models/challenges.models';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  addChallenge(value: any) {
    throw new Error('Method not implemented.');
  }

  private apiUrl = 'http://127.0.0.1:3000/api/challenges';

  

  constructor(private http: HttpClient) {}

  getAll(filters?: { date?: string; skill?: string }): Observable<Challenge[]> {
    let params = new HttpParams();
    if (filters?.date) params = params.set('date', filters.date);
    if (filters?.skill) params = params.set('skill', filters.skill);
    return this.http.get<Challenge[]>(`${this.apiUrl}/show`, { params });
  }

  /*getAll(): Observable<Challenge[]> {
    return this.http.get<Challenge[]>(`${this.apiUrl}/show`);
  }*/

  getById(_id: string): Observable<Challenge> {
    return this.http.get<Challenge>(`${this.apiUrl}/${_id}`);
  }

  create(challenge: Partial<Challenge>): Observable<Challenge> {
    return this.http.post<Challenge>(`${this.apiUrl}/add`, challenge);
  }

  saveUserScore(userId: string, challengeId: string, score: number): Observable<any> {
    const scoreData = { userId, challengeId, score };
    return this.http.post(`${this.apiUrl}/score`, scoreData);
  }
    
  update(_id: string, challenge: Partial<Challenge>): Observable<Challenge> {
    return this.http.put<Challenge>(`${this.apiUrl}/${_id}`, challenge);
  }

  delete(_id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${_id}`);
  }

  getUpcoming(): Observable<Challenge[]> {
    return this.http.get<Challenge[]>(`${this.apiUrl}/upcoming`);
  }

  validateCompletion(data: { userId: string; challengeId: string; score: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/validate`, data);
  }
  

  getTriviaQuestions(params: any): Observable<any> {
    const url = `${this.apiUrl}/trivia/questions`;
    console.log('Requête Trivia API avec paramètres :', params);
    return this.http.get(url, { params }).pipe(
      catchError((error) => {
        console.error('Erreur dans le service Angular :', error.message);
        return throwError(() => new Error('Erreur dans la récupération des questions.'));
      })
    );
  }

  getTriviaCategories(): Observable<any> {
    return this.http.get('https://opentdb.com/api_category.php').pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des catégories :', error.message);
        return throwError(() => new Error('Erreur dans la récupération des catégories.'));
      })
    );
  }
}
