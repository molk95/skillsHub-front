import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/sessions.service';

@Component({
  selector: 'app-delete-sessions',
  templateUrl: './delete-sessions.component.html',
  styleUrls: ['./delete-sessions.component.css']
})
export class DeleteSessionsComponent implements OnInit {
  sessions: any[] = []; // Liste des sessions
  errorMessage: string | null = null; // Pour afficher les erreurs

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.fetchSessions(); // Charger les sessions au démarrage
  }

  // Méthode pour récupérer les sessions
  fetchSessions(): void {
    this.sessionService.getAllSessions().subscribe({
      next: (data) => {
        this.sessions = data;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des sessions :', err);
        this.errorMessage = 'Erreur lors de la récupération des sessions.';
      }
    });
  }

  // Méthode pour supprimer une session
  onDelete(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette session ?')) {
      this.sessionService.deleteSession(id).subscribe({
        next: () => {
          alert('Session supprimée avec succès.');
          this.fetchSessions(); // Recharger les sessions après suppression
        },
        error: (err) => {
          console.error('Erreur lors de la suppression de la session :', err);
          this.errorMessage = 'Erreur lors de la suppression de la session.';
        }
      });
    }
  }
}