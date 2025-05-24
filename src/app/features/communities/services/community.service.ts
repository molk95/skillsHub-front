import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Community, CommunityCreateDto } from '../models/communities.model';
import { environment } from '../../../../environments/environment';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  // Remplacer l'URL de l'API par l'URL correcte de votre backend
  private apiUrl = 'http://localhost:3000/api/communities';

  constructor(private http: HttpClient) {
    console.log('Community service initialized with URL:', this.apiUrl);
  }

  // Get current user ID (this should be implemented based on your auth system)
  getCurrentUserId(): string {
    // Récupérer l'ID utilisateur du localStorage ou d'un service d'authentification
    const userId = localStorage.getItem('userId');

    // Si aucun utilisateur n'est connecté, utiliser un ID par défaut pour les tests
    return userId || '64f8b8e55a1c9b1c5e8b4567'; // Remplacez par un ID valide de votre base de données
  }

  // Check if user is member of a community
  isUserMember(communityId: string, userId: string): Observable<ApiResponse<boolean>> {
    const url = `${this.apiUrl}/${communityId}/isUserMember/${userId}`;
    return this.http.get<ApiResponse<boolean>>(url)
      .pipe(
        catchError(error => {
          console.error('API Error checking membership:', error);
          return throwError(() => error);
        })
      );
  }

  joinCommunity(communityId: string): Observable<ApiResponse<any>> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      console.error('No user ID found');
      return throwError(() => new Error('User ID not found'));
    }

    // Utiliser l'URL correcte selon votre API backend
    const url = `${this.apiUrl}/${communityId}/members/${userId}`;
    console.log('Joining community with URL:', url);

    return this.http.post<ApiResponse<any>>(url, {})
      .pipe(
        tap(response => console.log('Join response:', response)),
        catchError(error => {
          console.error('Join API Error:', error);
          return throwError(() => error);
        })
      );
  }

  leaveCommunity(communityId: string): Observable<ApiResponse<Community>> {
    const userId = this.getCurrentUserId();
    const url = `${this.apiUrl}/${communityId}/removeMember/${userId}`;
    return this.http.delete<ApiResponse<Community>>(url)
      .pipe(
        catchError(error => {
          console.error(`Error leaving community ${communityId}:`, error);
          return throwError(() => error);
        })
      );
  }

  // Get all communities
  getAllCommunities(): Observable<ApiResponse<Community[]>> {
    return this.http.get<ApiResponse<Community[]>>(this.apiUrl)
      .pipe(
        tap(response => {
          console.log('=== COMMUNAUTÉS CHARGÉES ===');
          console.log('Réponse complète:', response);
          if (response.data && response.data.length > 0) {
            console.log('Première communauté:', response.data[0]);
            console.log('Description de la première:', response.data[0].description);
          }
        }),
        catchError(error => {
          console.error('Error loading communities:', error);
          return throwError(() => error);
        })
      );
  }

  // Get community by ID
  getCommunityById(id: string): Observable<any> {
    console.log(`Fetching community with ID: ${id}`);
    return this.http.get<any>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(response => {
          console.log('Community details response:', response);
          console.log('Response structure:', JSON.stringify(response, null, 2));
        }),
        catchError(error => {
          console.error(`Error loading community ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  // Create new community
  createCommunity(community: CommunityCreateDto): Observable<ApiResponse<Community>> {
    console.log('Sending request to create community:', community);
    return this.http.post<ApiResponse<Community>>(this.apiUrl, community)
      .pipe(
        tap(response => console.log('Community creation response:', response)),
        catchError(error => {
          console.error('Error creating community:', error);
          return throwError(() => error);
        })
      );
  }

  // Delete community
  deleteCommunity(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Error deleting community ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  // Update community
  updateCommunity(id: string, community: CommunityCreateDto): Observable<any> {
    console.log(`=== MISE À JOUR COMMUNAUTÉ ===`);
    console.log(`ID: ${id}`);
    console.log(`Données:`, community);

    return this.http.put<any>(`${this.apiUrl}/${id}`, community)
      .pipe(
        tap(response => {
          console.log('=== RÉPONSE MISE À JOUR ===');
          console.log('Réponse complète:', response);
          console.log('Structure:', JSON.stringify(response, null, 2));
        }),
        catchError(error => {
          console.error(`❌ Erreur mise à jour ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  // Get community members
  getCommunityMembers(communityId: string): Observable<ApiResponse<any[]>> {
    const url = `${this.apiUrl}/${communityId}/members`;
    return this.http.get<ApiResponse<any[]>>(url)
      .pipe(
        catchError(error => {
          console.error(`Error loading members for community ${communityId}:`, error);
          return throwError(() => error);
        })
      );
  }

  // 1. Système de rôles et permissions dans une communauté
  assignRole(communityId: string, userId: string, role: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/${communityId}/members/${userId}/role`, { role });
  }

  // 2. Inviter des utilisateurs à rejoindre une communauté
  inviteUserToCommunity(communityId: string, email: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/${communityId}/invite`, { email });
  }

  // 3. Statistiques de la communauté
  getCommunityStats(communityId: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${communityId}/statistics`);
  }

  // 4. Recommandation de communautés similaires
  getSimilarCommunities(communityId: string): Observable<ApiResponse<Community[]>> {
    return this.http.get<ApiResponse<Community[]>>(`${this.apiUrl}/${communityId}/similar`);
  }

  // Add descriptions to communities
  addDescriptionsToCommunities(): Observable<any> {
    console.log('Adding descriptions to communities...');
    return this.http.post<any>(`${this.apiUrl}/add-descriptions`, {})
      .pipe(
        tap(response => console.log('Add descriptions response:', response)),
        catchError(error => {
          console.error('Add descriptions error:', error);
          return throwError(() => error);
        })
      );
  }
}






























