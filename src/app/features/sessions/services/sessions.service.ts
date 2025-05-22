import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class SessionService {
  // Utiliser l'URL de l'environnement comme les autres services
  private baseUrl = 'http://localhost:3000/api/sessions'

  constructor(private http: HttpClient) {}

  createSession(salonNom: string, sessionData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.baseUrl}/${salonNom}`, sessionData, { headers }).pipe(
      tap(response => console.log('Réponse du serveur après création:', response)),
      catchError(error => {
        console.error('Erreur lors de la création de la session :', error);
        return throwError(() => error);
      })
    );
  }
  
  // Récupérer toutes les sessions
  getAllSessions(): Observable<any[]> {
    // Ajouter un timestamp pour éviter la mise en cache
    const timestamp = new Date().getTime();
    console.log(`Tentative de connexion à: ${this.baseUrl}/?_=${timestamp}`);
    return this.http.get<any[]>(`${this.baseUrl}/?_=${timestamp}`).pipe(
      tap(response => console.log('Réponse du serveur pour getAllSessions:', response)),
      catchError(error => {
        console.error('Erreur détaillée lors de la récupération des sessions:', error);
        return throwError(() => error);
      })
    );
  }
  
  // Mettre à jour une session par ID
  updateSessionById(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data).pipe(
      tap(response => console.log('Réponse du serveur après mise à jour:', response)),
      catchError(error => {
        console.error('Erreur lors de la mise à jour de la session :', error);
        return throwError(() => error);
      })
    );
  }
  
  // Mettre à jour l'état d'une session
  updateSessionState(id: string, etat: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/etat`, { etat });
  }
  
  // Récupérer une session par ID
  getSessionById(id: string): Observable<any> {
    // Ajouter un timestamp pour éviter la mise en cache
    const timestamp = new Date().getTime();
    return this.http.get<any>(`${this.baseUrl}/${id}?_=${timestamp}`);
  }

  // Méthode pour supprimer une session
  deleteSession(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}























