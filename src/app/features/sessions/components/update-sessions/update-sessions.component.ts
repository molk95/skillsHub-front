import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SessionService } from "../../services/sessions.service";

@Component({
  selector: "app-update-session",
  templateUrl: "./update-sessions.component.html",
  styleUrls: ["./update-sessions.component.css"],
})
export class UpdateSessionComponent implements OnInit {
  sessionId: string = "";
  sessionData: any = {};
  isLoading: boolean = false;
  originalData: any = {}; // Pour stocker les données originales

  constructor(
    private sessionService: SessionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sessionId = this.route.snapshot.paramMap.get("id") || "";
    this.fetchSession();
  }

  fetchSession(): void {
    this.sessionService.getSessionById(this.sessionId).subscribe({
      next: (data: any) => { // Typage explicite
        console.log("Données reçues du backend:", data);
        this.originalData = JSON.parse(JSON.stringify(data)); // Copie profonde
        this.sessionData = data;
        
        // Convertir les dates pour l'affichage dans le formulaire
        if (this.sessionData.dateDebut) {
          this.sessionData.dateDebut = this.formatDateForInput(this.sessionData.dateDebut);
        }
        if (this.sessionData.dateFin) {
          this.sessionData.dateFin = this.formatDateForInput(this.sessionData.dateFin);
        }
      },
      error: (err: any) => { // Typage explicite
        console.error("Erreur lors de la récupération de la session :", err);
        alert("Erreur lors de la récupération de la session.");
      },
    });
  }

  // Convertit une date au format JJ/MM/AAAA HH:MM en format AAAA-MM-DDTHH:MM pour l'input HTML
  private formatDateForInput(dateStr: string): string {
    try {
      if (dateStr.includes('T')) {
        return dateStr.slice(0, 16);
      }
      if (dateStr.includes('/')) {
        const [datePart, timePart] = dateStr.split(' ');
        const [day, month, year] = datePart.split('/');
        return `${year}-${month}-${day}T${timePart}`;
      }
      const date = new Date(dateStr);
      return date.toISOString().slice(0, 16);
    } catch (error) {
      console.error("Erreur lors du formatage de la date pour l'input:", error);
      return dateStr;
    }
  }

  onSubmit(): void {
  if (!this.sessionData.type || !this.sessionData.dateDebut || 
      !this.sessionData.dateFin || !this.sessionData.createurNom) {
    alert("Tous les champs sont obligatoires");
    return;
  }

  const updatedData = { ...this.originalData };
  updatedData.type = this.sessionData.type;
  updatedData.createurNom = this.sessionData.createurNom;
  updatedData.etat = this.sessionData.etat || 'active';
  updatedData.dateDebut = this.sessionData.dateDebut;
  updatedData.dateFin = this.sessionData.dateFin;
  delete updatedData._id; 

  this.isLoading = true;
  this.sessionService.updateSessionById(this.sessionId, updatedData).subscribe({
    next: (response: any) => {
      alert("Session mise à jour avec succès !");
      // Récupère correctement le nom pour la route !
      // Attention à bien utiliser salonName (pas salonNom) dans la route
      const salonName = this.sessionData.salonId?.nom || this.originalData.salonId?.nom;
      if (salonName) {
          this.router.navigate(["/sessions/list", salonName]);
      } else {
        this.router.navigate(["/sessions/list",  salonName]);
      }
    },
    error: (err: any) => {
      alert(`Erreur lors de la mise à jour: ${err.message || 'Erreur inconnue'}`);
      this.isLoading = false;
    },
    complete: () => {
      this.isLoading = false;
    }
  });
}

  goBack(): void {
  window.history.back();
}
}
