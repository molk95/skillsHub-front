import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Feedback } from '../models/feedback.models';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  private baseUrl = 'http://localhost:3000/api/feedbacks'; // Remplacez par l'URL de votre backend

  constructor(private http: HttpClient) {}

  // Créer un feedback
  createFeedback(feedback: Feedback): Observable<Feedback> {
    return this.http.post<Feedback>(`${this.baseUrl}`, feedback);
  }

  // Récupérer tous les feedbacks
  getAllFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.baseUrl}`);
  }

  // Récupérer un feedback par ID
  getFeedbackById(id: string): Observable<Feedback> {
    return this.http.get<Feedback>(`${this.baseUrl}/${id}`);
  }

  // Mettre à jour un feedback
  updateFeedback(id: string, feedback: Partial<Feedback>): Observable<Feedback> {
    return this.http.put<Feedback>(`${this.baseUrl}/${id}`, feedback);
  }
  

  // Supprimer un feedback
  deleteFeedback(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }

  // Obtenir la note moyenne d'un utilisateur
  getAverageRating(userId: string): Observable<{ userId: string; averageRating: number }> {
    return this.http.get<{ userId: string; averageRating: number }>(`${this.baseUrl}/user/${userId}/average`);
  }

  // Récupérer les utilisateurs les mieux notés (Top 5 par défaut)
  getTopRatedUsers(limit: number = 5): Observable<{ _id: string; averageRating: number; count: number }[]> {
    return this.http.get<{ _id: string; averageRating: number; count: number }[]>(`${this.baseUrl}/top-rated`, {
      params: { limit: limit.toString() }
    });
  }
}
