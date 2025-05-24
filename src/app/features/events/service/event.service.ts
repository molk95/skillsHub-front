import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Event, EventCreateDto, EventUpdateDto } from '../models/event.model';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/core/models/api-response';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = environment.BASE_URL_API + 'events';

  constructor(private http: HttpClient) {}

  // Get current user ID (this should be implemented based on your auth system)
  getCurrentUserId(): string {
    // Récupérer l'ID utilisateur du localStorage ou d'un service d'authentification
    const userId = localStorage.getItem('userId');
    
    // Si aucun utilisateur n'est connecté, utiliser un ID par défaut pour les tests
    return userId || '64f8b8e55a1c9b1c5e8b4567'; // Remplacez par un ID valide de votre base de données
  }

  // Récupérer tous les événements
  getAllEvents(): Observable<ApiResponse<Event[]>> {
    return this.http.get<ApiResponse<Event[]>>(this.apiUrl)
      .pipe(
        tap(response => console.log('Events loaded:', response)),
        catchError(error => {
          console.error('Error loading events:', error);
          return throwError(() => error);
        })
      );
  }

  // Récupérer un événement par son ID
  getEventById(id: string): Observable<ApiResponse<Event>> {
    return this.http.get<ApiResponse<Event>>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(response => console.log('Event details loaded:', response)),
        catchError(error => {
          console.error(`Error loading event ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  // Créer un nouvel événement
  createEvent(event: EventCreateDto): Observable<ApiResponse<Event>> {
    // Ajouter l'ID de l'organisateur (utilisateur actuel)
    const eventWithOrganizer = {
      ...event,
      organizer: this.getCurrentUserId()
    };

    return this.http.post<ApiResponse<Event>>(this.apiUrl, eventWithOrganizer)
      .pipe(
        tap(response => console.log('Event created:', response)),
        catchError(error => {
          console.error('Error creating event:', error);
          return throwError(() => error);
        })
      );
  }

  // Mettre à jour un événement
  updateEvent(id: string, event: EventUpdateDto): Observable<ApiResponse<Event>> {
    return this.http.put<ApiResponse<Event>>(`${this.apiUrl}/${id}`, event)
      .pipe(
        tap(response => console.log('Event updated:', response)),
        catchError(error => {
          console.error(`Error updating event ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  // Supprimer un événement
  deleteEvent(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(response => console.log('Event deleted:', response)),
        catchError(error => {
          console.error(`Error deleting event ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  // Récupérer les événements d'une communauté
  getEventsByCommunity(communityId: string): Observable<ApiResponse<Event[]>> {
    return this.http.get<ApiResponse<Event[]>>(`${this.apiUrl}/community/${communityId}`)
      .pipe(
        tap(response => console.log(`Events for community ${communityId} loaded:`, response)),
        catchError(error => {
          console.error(`Error loading events for community ${communityId}:`, error);
          return throwError(() => error);
        })
      );
  }

  // Participer à un événement
  joinEvent(eventId: string): Observable<ApiResponse<Event>> {
    const userId = this.getCurrentUserId();
    return this.http.post<ApiResponse<Event>>(`${this.apiUrl}/${eventId}/participants/${userId}`, {})
      .pipe(
        tap(response => console.log('Joined event:', response)),
        catchError(error => {
          console.error(`Error joining event ${eventId}:`, error);
          return throwError(() => error);
        })
      );
  }

  // Quitter un événement
  leaveEvent(eventId: string): Observable<ApiResponse<Event>> {
    const userId = this.getCurrentUserId();
    return this.http.delete<ApiResponse<Event>>(`${this.apiUrl}/${eventId}/participants/${userId}`)
      .pipe(
        tap(response => console.log('Left event:', response)),
        catchError(error => {
          console.error(`Error leaving event ${eventId}:`, error);
          return throwError(() => error);
        })
      );
  }

  // Vérifier si l'utilisateur est l'organisateur de l'événement
  isEventOrganizer(event: Event): boolean {
    return event.organizer === this.getCurrentUserId();
  }

  // Vérifier si l'utilisateur participe à l'événement
  isEventParticipant(event: Event): boolean {
    return event.participants?.includes(this.getCurrentUserId()) || false;
  }

  // Récupérer les événements à venir
  getUpcomingEvents(): Observable<ApiResponse<Event[]>> {
    return this.http.get<ApiResponse<Event[]>>(`${this.apiUrl}/upcoming`)
      .pipe(
        tap(response => console.log('Upcoming events loaded:', response)),
        catchError(error => {
          console.error('Error loading upcoming events:', error);
          return throwError(() => error);
        })
      );
  }
}
