import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Forum } from '../models/forums.model';

@Injectable({ providedIn: 'root' })
export class ForumsService {
  private baseUrl = 'http://localhost:3000/api/forum';

  constructor(private http: HttpClient) {}

  getAllForums(): Observable<Forum[]> {
    return this.http.get<Forum[]>(`${this.baseUrl}`);
  }

  getForumById(id: string): Observable<Forum> {
    return this.http.get<Forum>(`${this.baseUrl}/${id}`);
  }

  addForum(forum: Partial<Forum>): Observable<Forum> {
    return this.http.post<Forum>(this.baseUrl, forum);
  }

  updateForum(id: string, forum: Partial<Forum>): Observable<Forum> {
    return this.http.put<Forum>(`${this.baseUrl}/${id}`, forum);
  }

  deleteForum(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  
}
