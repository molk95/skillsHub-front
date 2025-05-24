import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../service/event.service';
import { Event } from '../../models/event.model';
import { DatePipe } from '@angular/common';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css'],
  providers: [DatePipe]
})
export class EventDetailsComponent implements OnInit {
  event: Event | undefined;
  eventId: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  showParticipants: boolean = false;
  showConfirmDelete: boolean = false;

  // Map pour stocker les noms des participants
  participantNames: Map<string, string> = new Map();
  organizerName: string = 'Organisateur';

  // Helper methods to safely access event properties
  get eventParticipants(): string[] {
    return this.event?.participants || [];
  }

  get eventTags(): string[] {
    return this.event?.tags || [];
  }

  get participantCount(): number {
    return this.eventParticipants.length;
  }

  get hasParticipants(): boolean {
    return this.participantCount > 0;
  }

  get hasTags(): boolean {
    return this.eventTags.length > 0;
  }

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.eventId = id;
        this.loadEvent();
      } else {
        this.errorMessage = 'ID de l\'événement invalide.';
      }
    });
  }

  loadEvent(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.eventService.getEventById(this.eventId)
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.event = response.data;

            // Charger le nom de l'organisateur
            if (this.event.organizer) {
              this.userService.getUserName(this.event.organizer).subscribe({
                next: (name) => {
                  this.organizerName = name;
                  console.log('Nom de l\'organisateur récupéré:', name);
                },
                error: (error) => {
                  console.error('Erreur lors de la récupération du nom de l\'organisateur:', error);
                }
              });
            }

            // Charger les noms des participants
            this.loadParticipantNames();
          } else {
            this.errorMessage = response.message || 'Erreur lors du chargement de l\'événement';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading event:', error);
          this.errorMessage = 'Erreur lors du chargement de l\'événement: ' + (error.message || 'Erreur inconnue');
          this.isLoading = false;
        }
      });
  }

  joinEvent(): void {
    if (!this.event || !this.event.id) return;

    this.eventService.joinEvent(this.event.id)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.event = response.data;
            this.successMessage = 'Vous participez maintenant à cet événement';
            setTimeout(() => this.successMessage = '', 3000);
          } else {
            this.errorMessage = response.message || 'Erreur lors de l\'inscription à l\'événement';
          }
        },
        error: (error) => {
          console.error('Error joining event:', error);
          this.errorMessage = 'Erreur lors de l\'inscription à l\'événement: ' + (error.message || 'Erreur inconnue');
        }
      });
  }

  leaveEvent(): void {
    if (!this.event || !this.event.id) return;

    this.eventService.leaveEvent(this.event.id)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.event = response.data;
            this.successMessage = 'Vous ne participez plus à cet événement';
            setTimeout(() => this.successMessage = '', 3000);
          } else {
            this.errorMessage = response.message || 'Erreur lors de la désinscription de l\'événement';
          }
        },
        error: (error) => {
          console.error('Error leaving event:', error);
          this.errorMessage = 'Erreur lors de la désinscription de l\'événement: ' + (error.message || 'Erreur inconnue');
        }
      });
  }

  editEvent(): void {
    if (!this.event || !this.event.id) return;
    this.router.navigate(['/events/edit', this.event.id]);
  }

  confirmDelete(): void {
    this.showConfirmDelete = true;
  }

  cancelDelete(): void {
    this.showConfirmDelete = false;
  }

  deleteEvent(): void {
    if (!this.event || !this.event.id) return;

    this.eventService.deleteEvent(this.event.id)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/events']);
          } else {
            this.errorMessage = response.message || 'Erreur lors de la suppression de l\'événement';
            this.showConfirmDelete = false;
          }
        },
        error: (error) => {
          console.error('Error deleting event:', error);
          this.errorMessage = 'Erreur lors de la suppression de l\'événement: ' + (error.message || 'Erreur inconnue');
          this.showConfirmDelete = false;
        }
      });
  }

  goBackToList(): void {
    this.router.navigate(['/events']);
  }

  goToCommunity(): void {
    if (!this.event || !this.event.community) return;
    this.router.navigate(['/communities/details', this.event.community]);
  }

  isParticipant(): boolean {
    return this.event ? this.eventService.isEventParticipant(this.event) : false;
  }

  isOrganizer(): boolean {
    return this.event ? this.eventService.isEventOrganizer(this.event) : false;
  }

  toggleParticipants(): void {
    this.showParticipants = !this.showParticipants;
  }

  formatDate(date: string | undefined): string {
    if (!date) return '';
    return this.datePipe.transform(date, 'dd MMMM yyyy') || '';
  }

  getEventStatusClass(): string {
    if (!this.event) return '';

    const eventDate = new Date(this.event.date);
    const now = new Date();

    if (eventDate < now) {
      return 'bg-gray-500'; // Événement passé
    } else {
      const diffTime = Math.abs(eventDate.getTime() - now.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 7) {
        return 'bg-red-500'; // Événement dans moins d'une semaine
      } else {
        return 'bg-green-500'; // Événement à venir
      }
    }
  }

  getEventStatusText(): string {
    if (!this.event) return '';

    const eventDate = new Date(this.event.date);
    const now = new Date();

    if (eventDate < now) {
      return 'Terminé';
    } else {
      const diffTime = Math.abs(eventDate.getTime() - now.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) {
        return 'Aujourd\'hui';
      } else if (diffDays <= 7) {
        return 'Cette semaine';
      } else {
        return 'À venir';
      }
    }
  }

  copyToClipboard(text: string | undefined): void {
    if (!text) return;

    // Utiliser l'API Clipboard pour copier le texte
    navigator.clipboard.writeText(text)
      .then(() => {
        // Afficher un message de succès temporaire
        this.successMessage = 'Lien copié dans le presse-papier';
        setTimeout(() => this.successMessage = '', 3000);
      })
      .catch(err => {
        console.error('Erreur lors de la copie dans le presse-papier:', err);
        this.errorMessage = 'Impossible de copier le lien';
      });
  }

  // Charger les noms des participants
  loadParticipantNames(): void {
    if (!this.event || !this.event.participants || this.event.participants.length === 0) {
      return;
    }

    // Pour chaque ID de participant, récupérer son nom
    this.event.participants.forEach(participantId => {
      this.userService.getUserName(participantId).subscribe({
        next: (name) => {
          this.participantNames.set(participantId, name);
          console.log(`Nom du participant ${participantId} récupéré:`, name);
        },
        error: (error) => {
          console.error(`Erreur lors de la récupération du nom du participant ${participantId}:`, error);
          this.participantNames.set(participantId, 'Participant');
        }
      });
    });
  }

  // Obtenir le nom d'un participant à partir de son ID
  getParticipantName(participantId: string): string {
    return this.participantNames.get(participantId) || 'Participant';
  }
}
