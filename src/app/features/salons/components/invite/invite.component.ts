import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SalonsService } from '../../services/salons.service';
import { ISalon } from '../../models/salons.model';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {
  email: string = '';
  salonId: string = '';
  salonNom: string = '';
  message: string = '';
  etherealPreview: string = '';
  loading: boolean = false;
  salon: ISalon | null = null;
  // Ajout d'une propriété pour gérer plusieurs emails
  emails: string[] = [];
  multipleEmails: boolean = false;
  emailInput: string = '';

  constructor(
    private salonService: SalonsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID du salon depuis l'URL
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.salonId = params['id'];
        this.loadSalonDetails();
      }
    });
  }

  loadSalonDetails(): void {
    this.salonService.getSalonByName(this.salonId).subscribe({
      next: (salon) => {
        this.salon = salon[0]; // Get the first salon from the array
        this.salonNom = salon[0].nom; // Access the first salon's name
      },
      error: (err) => {
        console.error('Erreur lors du chargement des détails du salon:', err);
        this.message = 'Erreur lors du chargement des détails du salon';
      }
    });
  }

  // Méthode pour ajouter un email à la liste
  ajouterEmail(): void {
    if (this.emailInput && this.emailInput.includes('@')) {
      this.emails.push(this.emailInput);
      this.emailInput = '';
    }
  }

  // Méthode pour supprimer un email de la liste
  supprimerEmail(index: number): void {
    this.emails.splice(index, 1);
  }

  envoyerInvitation(): void {
    if (this.multipleEmails) {
      // Si on est en mode multiple emails
      if (this.emails.length === 0) {
        this.message = 'Veuillez ajouter au moins un email à la liste';
        return;
      }
      
      this.loading = true;
      this.message = 'Envoi des invitations en cours...';
      this.etherealPreview = '';

      this.salonService.inviterParticipant(this.salonId, this.emails).subscribe({
        next: (res) => {
          this.loading = false;
          this.message = res.message || 'Invitations envoyées avec succès';
          
          // Si c'est un email de test Ethereal, afficher le lien de prévisualisation du premier
          if (res.results && res.results.length > 0 && res.results[0].previewUrl) {
            this.etherealPreview = res.results[0].previewUrl;
          }
          
          // Réinitialiser les emails après un court délai
          setTimeout(() => {
            this.emails = [];
          }, 2000);
        },
        error: (err) => {
          this.loading = false;
          this.message = err.message || 'Erreur lors de l\'envoi des invitations';
          console.error('Erreur détaillée:', err);
        }
      });
    } else {
      // Mode email unique (code existant)
      if (!this.email || !this.email.includes('@')) {
        this.message = 'Veuillez entrer une adresse email valide';
        return;
      }

      this.loading = true;
      this.message = 'Envoi de l\'invitation en cours...';
      this.etherealPreview = '';

      this.salonService.inviterParticipant(this.salonId, this.email).subscribe({
        next: (res) => {
          this.loading = false;
          this.message = res.message || 'Invitation envoyée avec succès';
          
          // Si c'est un email de test Ethereal, afficher le lien de prévisualisation
          if (res.results && res.results.length > 0 && res.results[0].previewUrl) {
            this.etherealPreview = res.results[0].previewUrl;
          } else if (res.previewUrl || res.etherealPreview) {
            this.etherealPreview = res.previewUrl || res.etherealPreview;
          }
          
          // Réinitialiser le champ email après un court délai
          setTimeout(() => {
            this.email = '';
          }, 2000);
        },
        error: (err) => {
          this.loading = false;
          this.message = err.message || 'Erreur lors de l\'envoi de l\'invitation';
          console.error('Erreur détaillée:', err);
        }
      });
    }
  }

  retourAuSalon(): void {
    this.router.navigate(['/salons/list']);
  }
}



