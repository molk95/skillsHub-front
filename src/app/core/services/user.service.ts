import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) { }

  getUserNameById(userId: string): Observable<string> {
    // Pour l'instant, retournons un nom par défaut
    // Vous pouvez implémenter l'appel API réel plus tard
    return of(`Utilisateur ${userId.substring(0, 8)}`);
  }

  getUserName(userId: string): Observable<string> {
    // Alias pour getUserNameById
    return this.getUserNameById(userId);
  }

  getCurrentUser(): Observable<any> {
    // Retourner un utilisateur par défaut pour les tests
    return of({
      _id: '64f8b8e55a1c9b1c5e8b4567',
      name: 'Utilisateur Test',
      email: 'test@example.com'
    });
  }

  getUserById(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  getCurrentUserId(): string {
    return localStorage.getItem('currentUserId') || 'default-user-id';
  }
}
