import { Component, OnInit } from '@angular/core';
import { EventService } from '../../service/event.service';
import { Event } from '../../models/event.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events-list',
  templateUrl: './list-event.component.html',
  styleUrls: ['./list-event.component.css']
})
export class ListEventComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  searchQuery = '';
  filterType = 'all'; // 'all', 'upcoming', 'past', 'participating'

  constructor(
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.eventService.getAllEvents()
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.events = response.data;
            this.applyFilters();
          } else {
            this.errorMessage = 'Erreur lors du chargement des événements';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading events:', error);
          this.errorMessage = 'Erreur lors du chargement des événements: ' + (error.message || 'Erreur inconnue');
          this.isLoading = false;
        }
      });
  }

  applyFilters(): void {
    let filtered = [...this.events];

    // Appliquer la recherche textuelle
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
      );
    }

    // Appliquer le filtre de type
    const now = new Date();

    switch (this.filterType) {
      case 'upcoming':
        filtered = filtered.filter(event => new Date(event.date) >= now);
        break;
      case 'past':
        filtered = filtered.filter(event => new Date(event.date) < now);
        break;
      case 'participating':
        filtered = filtered.filter(event => this.eventService.isEventParticipant(event));
        break;
      // 'all' ne nécessite pas de filtre supplémentaire
    }

    // Trier par date (du plus récent au plus ancien)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    this.filteredEvents = filtered;
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(filterType: string): void {
    this.filterType = filterType;
    this.applyFilters();
  }

  navigateToEventDetails(eventId: string): void {
    this.router.navigate(['/events/details', eventId]);
  }

  createNewEvent(): void {
    this.router.navigate(['/events/add']);
  }

  joinEvent(event: Event, e: MouseEvent): void {
    e.stopPropagation(); // Empêcher la navigation vers les détails

    if (!event.id) {
      this.errorMessage = 'ID de l\'événement invalide';
      return;
    }

    this.eventService.joinEvent(event.id)
      .subscribe({
        next: (response) => {
          if (response.success) {
            // Mettre à jour l'événement dans la liste
            const index = this.events.findIndex(e => e.id === event.id);
            if (index !== -1) {
              this.events[index] = response.data;
              this.applyFilters();
            }

            this.successMessage = 'Vous participez maintenant à cet événement';
            setTimeout(() => this.successMessage = null, 3000);
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

  leaveEvent(event: Event, e: MouseEvent): void {
    e.stopPropagation(); // Empêcher la navigation vers les détails

    if (!event.id) {
      this.errorMessage = 'ID de l\'événement invalide';
      return;
    }

    this.eventService.leaveEvent(event.id)
      .subscribe({
        next: (response) => {
          if (response.success) {
            // Mettre à jour l'événement dans la liste
            const index = this.events.findIndex(e => e.id === event.id);
            if (index !== -1) {
              this.events[index] = response.data;
              this.applyFilters();
            }

            this.successMessage = 'Vous ne participez plus à cet événement';
            setTimeout(() => this.successMessage = null, 3000);
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

  isParticipant(event: Event): boolean {
    return this.eventService.isEventParticipant(event);
  }

  isOrganizer(event: Event): boolean {
    return this.eventService.isEventOrganizer(event);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }
}




