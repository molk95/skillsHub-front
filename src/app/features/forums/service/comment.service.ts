import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Comment } from '../models/comment.model';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = environment.BASE_URL_API + 'comments';

  constructor(private http: HttpClient) {}

  // Get current user ID (this should be implemented based on your auth system)
  getCurrentUserId(): string {
    // Récupérer l'ID utilisateur du localStorage ou d'un service d'authentification
    const userId = localStorage.getItem('userId');

    // Si aucun utilisateur n'est connecté, utiliser un ID par défaut pour les tests
    return userId || '64f8b8e55a1c9b1c5e8b4567'; // Remplacez par un ID valide de votre base de données
  }

  // Récupérer tous les commentaires d'un forum
  getCommentsByForumId(forumId: string): Observable<ApiResponse<Comment[]>> {
    return this.http.get<ApiResponse<Comment[]>>(`${this.apiUrl}/forum/${forumId}`);
  }

  // Ajouter un commentaire
  addComment(comment: Comment): Observable<ApiResponse<Comment>> {
    return this.http.post<ApiResponse<Comment>>(this.apiUrl, comment);
  }

  // Mettre à jour un commentaire
  updateComment(id: string, comment: Comment): Observable<ApiResponse<Comment>> {
    return this.http.put<ApiResponse<Comment>>(`${this.apiUrl}/${id}`, comment);
  }

  // Supprimer un commentaire
  deleteComment(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }

  // Aimer un commentaire
  likeComment(id: string): Observable<ApiResponse<Comment>> {
    return this.http.post<ApiResponse<Comment>>(`${this.apiUrl}/${id}/like`, {});
  }

  // Créer un commentaire temporaire (pour le développement)
  createTemporaryComment(content: string, forumId: string): Comment {
    return {
      content: content,
      author: this.getCurrentUserId(),
      authorName: 'Utilisateur actuel', // À remplacer par le nom réel de l'utilisateur
      forum: forumId,
      created_at: new Date().toISOString(),
      likes: 0
    };
  }
}
