import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Badge } from '../models/badge.model';

@Injectable({
  providedIn: 'root'
})
export class BadgeService {

  private apiUrl = 'http://localhost:3000/api/badges';

  constructor(private http: HttpClient) {}

  getAllBadges(): Observable<Badge[]> {
    return this.http.get<Badge[]>(`${this.apiUrl}`);
  }

  getBadgeById(_id: any): Observable<Badge> {
    return this.http.get<Badge>(`${this.apiUrl}/${_id}`);
  }

  getBadgesByUser(userId: any): Observable<Badge[]> {
    console.log(`Appel à l'API pour récupérer les badges de l'utilisateur avec ID : ${userId}`);
    return this.http.get<Badge[]>(`${this.apiUrl}/user/${userId}`);
  }
  

  createBadge(badge: Partial<Badge>): Observable<Badge> {
    return this.http.post<Badge>(`${this.apiUrl}`, badge);
  }

  assignBadge(userId: string, score: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/assign`, { userId, score });
  }

  /*updateBadge(_id: any, badge: Partial<Badge>): Observable<Badge> {
    return this.http.put<Badge>(`${this.apiUrl}/${_id}`, badge);
  }*/

  deleteBadge(_id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${_id}`);
  }

  getLeaderboard(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/leaderboard`);
  }
}
