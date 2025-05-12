import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ISalon } from '../models/salons.model';

@Injectable({
  providedIn: 'root',
})
export class SalonsService {
  private baseUrl = `${environment.BASE_URL_API}/salons`;

  constructor(private http: HttpClient) {}

  // ➕ Ajouter un salon
  addSalon(salon: ISalon): Observable<ISalon> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<ISalon>(this.baseUrl, salon, { headers }).pipe(
      catchError((error) => {
        console.error('Erreur lors de l\'ajout du salon :', error);
        return throwError(() => error);
      })
    );
  }
   // Récupérer les salons avec leurs sessions associées
  getSalonsWithSessions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/salons-with-sessions`);
  }

  // 📋 Récupérer tous les salons
  getAllSalons(): Observable<ISalon[]> {
    console.log(`Tentative de récupération des salons depuis: ${this.baseUrl}`);
    return this.http.get<ISalon[]>(this.baseUrl).pipe(
      tap(response => console.log('Réponse du serveur pour getAllSalons:', response)),
      catchError((error) => {
        console.error('Erreur détaillée lors de la récupération des salons:', error);
        return throwError(() => error);
      })
    );
  }

  // 🔍 Récupérer un salon par nom
  getSalonByName(name: string): Observable<ISalon[]> {
    const encodedName = encodeURIComponent(name);
    console.log(`Tentative de récupération du salon avec le nom "${name}" depuis: ${this.baseUrl}/nom/${encodedName}`);
    return this.http.get<ISalon[]>(`${this.baseUrl}/nom/${encodedName}`).pipe(
      catchError((error) => {
        console.error(`Erreur lors de la récupération du salon avec le nom "${name}":`, error);
        return throwError(() => error);
      })
    );
  }

  // 🔄 Mettre à jour un salon par nom
  updateSalonByName(nom: string, data: { description: string }): Observable<ISalon> {
    const encodedName = encodeURIComponent(nom);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<ISalon>(`${this.baseUrl}/nom/${encodedName}`, data, { headers }).pipe(
      catchError((error) => {
        console.error(`Erreur lors de la mise à jour du salon avec le nom "${nom}":`, error);
        return throwError(() => error);
      })
    );
  }

  // 🗑️ Supprimer un salon par nom
  deleteSalonByName(name: string): Observable<void> {
    const encodedName = encodeURIComponent(name);
    return this.http.delete<void>(`${this.baseUrl}/nom/${encodedName}`).pipe(
      catchError((error) => {
        console.error(`Erreur lors de la suppression du salon avec le nom "${name}":`, error);
        return throwError(() => error);
      })
    );
  }
}

