import { Component, OnInit, OnDestroy } from "@angular/core";
import { SessionService } from "../../services/sessions.service";
import { Router, NavigationEnd } from "@angular/router"; 
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-session-list",
  templateUrl: "./list-sessions.component.html",
  styleUrls: ["./list-sessions.component.css"],
})
export class SessionListComponent implements OnInit, OnDestroy {
  sessions: any[] = []; // Liste des sessions
  errorMessage: string | null = null;
  salonName: string = '';
  loading = false;
  viewMode: 'card' | 'list' = 'card';
  private routerSubscription: Subscription | null = null;
  private routeSubscription: Subscription | null = null;
  
  constructor(private sessionService: SessionService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Récupérer le paramètre salonName depuis l'URL
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.salonName = params.get('salonName') || '';
      this.fetchSessions();
    });

    // S'abonner aux événements de navigation pour actualiser la liste
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.url.startsWith('/sessions/list')) {
          this.fetchSessions();
        }
      });
  }
  
  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

fetchSessions(): void {
  console.log('Salon recherché:', this.salonName);
  if (!this.salonName) {
    this.sessions = [];
    this.errorMessage = "Aucun salon sélectionné.";
    return;
  }
  this.loading = true;
  this.sessionService.getSessionsBySalonName(this.salonName).subscribe({
    next: (data) => {
      console.log('Sessions récupérées:', data);
      this.sessions = data;
      this.errorMessage = null;
      this.loading = false;
    },
    error: (err) => {
      this.errorMessage = "Erreur lors de la récupération des sessions.";
      this.sessions = [];
      this.loading = false;
    },
  });
}


  onSalonNameChange(): void {
    this.fetchSessions();
  }

  onDelete(id: string): void {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette session ?")) {
      this.sessionService.deleteSession(id).subscribe({
        next: () => {
          alert("Session supprimée avec succès.");
          this.fetchSessions();
        },
        error: (err) => {
          console.error("Erreur lors de la suppression de la session :", err);
          this.errorMessage = "Erreur lors de la suppression de la session.";
        },
      });
    }
  }

  navigateToUpdate(id: string): void {
    this.router.navigate(["/sessions/update", id]);
  }

  updateState(id: string, etat: string): void {
    this.sessionService.updateSessionState(id, etat).subscribe({
      next: () => {
        alert("État de la session mis à jour avec succès.");
        this.fetchSessions();
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour de l'état de la session :", err);
        alert("Erreur lors de la mise à jour de l'état de la session.");
      },
    });
  }

  refreshList(): void {
    this.fetchSessions();
  }
  joinSession(session: any): void {
  // Exemple : redirection vers une page de détail ou d'accès à la session
  // Adapte l'URL selon ta logique (par exemple /sessions/join/:id)
  this.router.navigate(['/sessions/join', session._id]);
  // Ou, si c'est juste un lien externe :
  // window.open(session.lien, '_blank');
}

}