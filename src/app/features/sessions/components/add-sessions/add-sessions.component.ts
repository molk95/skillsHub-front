import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../services/sessions.service'; // Assurez-vous que le chemin est correct
import { v4 as uuidv4 } from 'uuid'; // Importation pour générer un ID unique

@Component({
  selector: 'app-add-sessions',
  templateUrl: './add-sessions.component.html',
  styleUrls: ['./add-sessions.component.css'],
})
export class AddSessionsComponent {
  salonNom: string = ''; // Nom du salon
  sessionData = {
    id: '', // ID généré automatiquement
    type: '',
    dateDebut: '',
    dateFin: '',
    createurNom: '',
    etat: 'active', // État par défaut
  };
  isLoading: boolean = false; // Indicateur de chargement

  constructor(private sessionService: SessionService, private router: Router) {}

  // Méthode utilitaire pour convertir les dates au format JJ/MM/AAAA HH:mm
  private formatDate(date: string): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  // Méthode pour soumettre le formulaire
  onSubmit() {
    // Vérifier que tous les champs obligatoires sont remplis
    if (
      !this.salonNom ||
      !this.sessionData.type ||
      !this.sessionData.dateDebut ||
      !this.sessionData.dateFin ||
      !this.sessionData.createurNom
    ) {
      alert('Tous les champs sont obligatoires');
      return;
    }

    // Générer un ID unique pour la session
    this.sessionData.id = uuidv4();

    // Formatage des dates
    const formattedDateDebut = this.formatDate(this.sessionData.dateDebut);
    const formattedDateFin = this.formatDate(this.sessionData.dateFin);

    // Préparer les données au format attendu par le backend
    const sessionData = {
      id: this.sessionData.id,
      type: this.sessionData.type,
      dateDebut: formattedDateDebut,
      dateFin: formattedDateFin,
      createurNom: this.sessionData.createurNom,
      etat: this.sessionData.etat,
    };

    this.isLoading = true; // Activer l'indicateur de chargement
    this.sessionService.createSession(this.salonNom, sessionData).subscribe({
      next: (response: any) => {
        alert('Session créée avec succès !');
        this.isLoading = false;
        this.router.navigate(['/sessions/list']); // Rediriger vers la liste des sessions
      },
      error: (err: any) => {
        console.error('Erreur lors de la création de la session :', err);
        alert('Une erreur est survenue.');
        this.isLoading = false; // Désactiver l'indicateur de chargement
      },
    });
  }
}