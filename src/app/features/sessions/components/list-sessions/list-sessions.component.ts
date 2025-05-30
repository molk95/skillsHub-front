import { Component, OnInit, OnDestroy } from "@angular/core";
import { SessionService } from "../../services/sessions.service";
import { Router, NavigationEnd } from "@angular/router"; 
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-session-list",
  templateUrl: "./list-sessions.component.html",
  styleUrls: ["./list-sessions.component.css"],
})
export class SessionListComponent implements OnInit, OnDestroy {
  sessions: any[] = []; // Liste des sessions
  errorMessage: string | null = null;
  private routerSubscription: Subscription | null = null;

  constructor(private sessionService: SessionService, private router: Router) {}
  
  ngOnInit(): void {
    this.fetchSessions(); // Charger la liste des sessions
    
    // S'abonner aux événements de navigation pour actualiser la liste
    // quand on revient à cette page après une mise à jour
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // Si on navigue vers la liste des sessions, actualiser les données
        if (event.url === '/sessions/list') {
          this.fetchSessions();
        }
      });
  }
  
  ngOnDestroy(): void {
    // Se désabonner pour éviter les fuites de mémoire
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // Méthode pour récupérer les sessions
  fetchSessions(): void {
    this.sessionService.getAllSessions().subscribe({
      next: (data) => {
        console.log("Sessions récupérées:", data);
        this.sessions = data;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des sessions :", err);
        this.errorMessage = "Erreur lors de la récupération des sessions.";
      },
    });
  }

  // Méthode pour supprimer une session
  onDelete(id: string): void {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette session ?")) {
      this.sessionService.deleteSession(id).subscribe({
        next: () => {
          alert("Session supprimée avec succès.");
          this.fetchSessions(); // Réactualiser la liste après suppression
        },
        error: (err) => {
          console.error("Erreur lors de la suppression de la session :", err);
          this.errorMessage = "Erreur lors de la suppression de la session.";
        },
      });
    }
  }
  
  navigateToUpdate(id: string): void {
    // Redirection vers la page de mise à jour
    this.router.navigate(["/sessions/update", id]);
  }

  updateState(id: string, etat: string): void {
    this.sessionService.updateSessionState(id, etat).subscribe({
      next: () => {
        alert("État de la session mis à jour avec succès.");
        this.fetchSessions(); // Actualiser la liste après la mise à jour
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour de l'état de la session :", err);
        alert("Erreur lors de la mise à jour de l'état de la session.");
      },
    });
  }
  
  // Méthode pour actualiser manuellement la liste
  refreshList(): void {
    this.fetchSessions();
  }
}
