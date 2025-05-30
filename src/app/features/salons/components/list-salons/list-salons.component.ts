import { Component, OnInit } from '@angular/core';
import { SalonsService } from '../../services/salons.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ISalon } from '../../models/salons.model';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-list-salons',
  templateUrl: './list-salons.component.html',
  styleUrls: ['./list-salons.component.css']
})

export class ListSalonsComponent implements OnInit {
  salons: ISalon[] = [];
  salonSelectionne: ISalon | null = null;
  // Champs pour la recherche multi-critères
  searchNom: string = '';
  searchDescription: string = '';
  searchCreateurNom: string = '';
  searchEtat: string = '';
  searchDateMin: string = '';
  searchDateMax: string = '';

  // Champs pour l'invitation
  emailInvite: string = '';
  messageInvitation: string = '';
  etherealPreview: string = '';

  // Propriété pour stocker tous les salons (pour la recherche côté client)
  allSalons: ISalon[] = [];
  isServerSearchFailing: boolean = false;
  skillName: string = '';
  tutorName: string = '';
  searchTerm: string = '';

  constructor(private salonService: SalonsService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Récupérer les paramètres de recherche depuis l'URL
    this.route.queryParams.subscribe((params: { [key: string]: string }) => {
      this.skillName = params['skillName'] || '';
      this.tutorName = params['tutorName'] || '';
      
      // Si des paramètres sont présents, effectuer une recherche automatique
      if (this.skillName || this.tutorName) {
        // Construire le terme de recherche en combinant le nom de la compétence et le tuteur
        this.searchTerm = [this.skillName, this.tutorName].filter(Boolean).join(' ');
        console.log(`Recherche automatique avec le terme: "${this.searchTerm}"`);
        this.rechercherParMotsCles(this.searchTerm.split(' ').filter(Boolean));
      } else {
        // Sinon, charger tous les salons
        this.chargerSalons();
      }
    });
  }

  chargerSalons(): void {
    this.salonService.getAllSalons().subscribe({
      next: (data) => {
        this.salons = data;
        this.allSalons = [...data]; // Garder une copie de tous les salons
      },
      error: (err) => {
        if (err.status === 0) {
          alert('Impossible de se connecter au serveur. Vérifiez que le backend est démarré et accessible.');
        } else {
          console.error('Erreur lors du chargement des salons:', err);
        }
      }
    }); }

  rechercherSalons(): void {
    const filters: any = {};
    if (this.searchNom.trim()) filters.nom = this.searchNom.trim();
    if (this.searchDescription.trim()) filters.description = this.searchDescription.trim();
    if (this.searchCreateurNom.trim()) filters.createurNom = this.searchCreateurNom.trim();
    if (this.searchEtat) filters.etat = this.searchEtat;
    if (this.searchDateMin) filters.dateMin = this.searchDateMin;
    if (this.searchDateMax) filters.dateMax = this.searchDateMax;

    if (Object.keys(filters).length === 0) {
      this.chargerSalons();
      return;
    }
    
    // Si la recherche côté serveur a échoué précédemment, utiliser la recherche côté client
    if (this.isServerSearchFailing) {
      this.rechercherSalonsCoteClient(filters);
      return;
    }
    
    // Ajouter un indicateur de chargement
    this.salons = [];
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) loadingIndicator.style.display = 'block';
    
    this.salonService.searchSalons(filters).subscribe({
      next: (data) => {
        this.salons = data;
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        this.isServerSearchFailing = false;
        
        // Afficher un message si aucun résultat
        if (data.length === 0) {
          this.showNotification('Aucun salon trouvé avec ces critères.', 'info');
        }
      },
      error: (err) => {
        console.error('Erreur lors de la recherche de salons', err);
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        
        // Marquer que la recherche côté serveur échoue
        this.isServerSearchFailing = true;
        
        // Utiliser la recherche côté client comme solution de secours
        this.showNotification('La recherche côté serveur a échoué. Utilisation de la recherche locale.', 'warning');
        this.rechercherSalonsCoteClient(filters);
      }
    });
  }

  // Méthode pour rechercher des salons côté client
  rechercherSalonsCoteClient(filters: any): void {
    // Filtrer les salons côté client
    let resultats = [...this.allSalons];
    
    if (filters.nom) {
      const nomLower = filters.nom.toLowerCase();
      resultats = resultats.filter(salon => 
        salon.nom.toLowerCase().includes(nomLower)
      );
    }
    
    if (filters.description) {
      const descLower = filters.description.toLowerCase();
      resultats = resultats.filter(salon => 
        salon.description && salon.description.toLowerCase().includes(descLower)
      );
    }
    
    if (filters.createurNom) {
      const createurLower = filters.createurNom.toLowerCase();
      resultats = resultats.filter(salon => 
        salon.createurId && salon.createurId.toLowerCase().includes(createurLower)
      );
    }
    
    if (filters.etat) {
      // Skip this filter as 'etat' property doesn't exist on ISalon type
      // Consider adding the property to the ISalon interface if needed
    }
    
    if (filters.dateMin) {
      const dateMin = new Date(filters.dateMin);
      resultats = resultats.filter(salon => 
        new Date(salon.dateCreation) >= dateMin
      );
    }
    
    if (filters.dateMax) {
      const dateMax = new Date(filters.dateMax);
      resultats = resultats.filter(salon => 
        new Date(salon.dateCreation) <= dateMax
      );
    }
    
    this.salons = resultats;
    
    if (resultats.length === 0) {
      this.showNotification('Aucun salon trouvé avec ces critères.', 'info');
    }
  }
  
  // Nouvelle méthode pour rechercher par mots-clés individuels
  private rechercherParMotsCles(keywords: string[]): void {
    // Créer un tableau pour stocker les résultats de recherche
    let resultats: any[] = [];
    
    // Compteur pour suivre les recherches terminées
    let recherchesTerminees = 0;
    
    // Pour chaque mot-clé, effectuer une recherche
    keywords.forEach(keyword => {
      this.salonService.getSalonByName(keyword).subscribe({
        next: (data) => {
          // Ajouter les résultats au tableau
          resultats = [...resultats, ...data];
          recherchesTerminees++;
          
          // Si toutes les recherches sont terminées, traiter les résultats
          if (recherchesTerminees === keywords.length) {
            // Éliminer les doublons
            this.salons = this.eliminerDoublons(resultats);
            console.log(`Résultats de la recherche par mots-clés: ${this.salons.length} salons trouvés`);
          }
        },
        error: (err) => {
          console.error(`Erreur lors de la recherche avec le mot-clé "${keyword}":`, err);
          recherchesTerminees++;
          
          // Si toutes les recherches sont terminées, traiter les résultats
          if (recherchesTerminees === keywords.length) {
            // Éliminer les doublons
            this.salons = this.eliminerDoublons(resultats);
            console.log(`Résultats de la recherche par mots-clés: ${this.salons.length} salons trouvés`);
          }
        }
      });
    });
  }
  
  // Méthode pour éliminer les doublons dans les résultats
  private eliminerDoublons(salons: any[]): any[] {
    const salonMap = new Map();
    salons.forEach(salon => {
      if (!salonMap.has(salon._id)) {
        salonMap.set(salon._id, salon);
      }
    });
    return Array.from(salonMap.values());
  }

  mettreAJourSalon(nom: string) {
    this.router.navigate(['/salons/update', nom]);
  }

  supprimerSalon(nom: string) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le salon "${nom}" ?`)) {
      this.salonService.deleteSalonByName(nom).subscribe(
        () => {
          this.salons = this.salons.filter(salon => salon.nom !== nom);
          alert(`Le salon "${nom}" a été supprimé avec succès.`);
        },
        error => {
          alert(`Une erreur s'est produite lors de la suppression du salon "${nom}".`);
        }
      );
    }
  }

  // Affiche ou cache le formulaire d'invitation pour ce salon
  ouvrirInvitation(salon: ISalon) {
    if (this.salonSelectionne === salon) {
      this.salonSelectionne = null;
      this.emailInvite = '';
      this.messageInvitation = '';
      this.etherealPreview = '';
    } else {
      this.salonSelectionne = salon;
      this.emailInvite = '';
      this.messageInvitation = '';
      this.etherealPreview = '';
    }
  }

  // Méthode pour inviter un participant
  inviterParticipant(salon: ISalon): void {
    if (!this.emailInvite || !this.emailInvite.includes('@')) {
      this.messageInvitation = 'Veuillez entrer une adresse email valide.';
      return;
    }

    // Afficher un message de chargement
    this.messageInvitation = 'Envoi de l\'invitation en cours...';
    
    // Appel au service avec un email unique
    this.salonService.inviterParticipant(salon._id as string, this.emailInvite).subscribe({
      next: (response) => {
        this.messageInvitation = 'Invitation envoyée avec succès !';
        
        // Si le backend renvoie des détails sur les invitations
        if (response.results && response.results.length > 0) {
          const invitationDetail = response.results.find((d: any) => d.email === this.emailInvite);
          if (invitationDetail && invitationDetail.previewUrl) {
            this.etherealPreview = invitationDetail.previewUrl;
          }
        }
        
        // Réinitialiser le champ email après un délai
        setTimeout(() => {
          this.emailInvite = '';
        }, 2000);
      },
      error: (err) => {
        console.error('Erreur lors de l\'envoi de l\'invitation', err);
        this.messageInvitation = 'Erreur lors de l\'envoi de l\'invitation. Veuillez réessayer.';
      }
    });
  }

  uploadPdf(event: any, salon: ISalon) {
    const file = event.target.files[0];
    if (!file || !salon._id) return;
    this.salonService.uploadSalonFile(file, salon._id).subscribe({
      next: data => {
        // Redirige vers la page des documents du salon spécifique
        this.router.navigate(['/salon', salon._id, 'documents']);
      },
      error: err => alert('Erreur lors de l\'upload')
    });
  }

  // Méthode améliorée pour afficher des notifications
  showNotification(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info'): void {
    // Créer un élément de notification
    const notificationEl = document.createElement('div');
    notificationEl.className = `alert alert-${type} alert-dismissible fade show rounded-4 shadow-sm`;
    notificationEl.role = 'alert';
    notificationEl.style.marginBottom = '10px';
    
    // Ajouter une icône en fonction du type
    let icon = '';
    switch (type) {
      case 'success': icon = '<i class="fas fa-check-circle me-2"></i>'; break;
      case 'error': icon = '<i class="fas fa-exclamation-circle me-2"></i>'; break;
      case 'warning': icon = '<i class="fas fa-exclamation-triangle me-2"></i>'; break;
      default: icon = '<i class="fas fa-info-circle me-2"></i>';
    }
    
    notificationEl.innerHTML = `
      ${icon}${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Ajouter au conteneur de notifications
    const container = document.getElementById('notification-container');
    if (container) {
      container.appendChild(notificationEl);
      
      // Supprimer automatiquement après 5 secondes
      setTimeout(() => {
        notificationEl.classList.remove('show');
        setTimeout(() => notificationEl.remove(), 300);
      }, 5000);
    } else {
      // Fallback si le conteneur n'existe pas
      alert(message);
    }
  }

  // Méthode pour basculer l'affichage des filtres avancés
  toggleAdvancedFilters(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const filtersElement = document.getElementById('advancedFilters');
    if (filtersElement) {
      if (filtersElement.classList.contains('show')) {
        filtersElement.classList.remove('show');
        (event.target as HTMLElement).setAttribute('aria-expanded', 'false');
      } else {
        filtersElement.classList.add('show');
        (event.target as HTMLElement).setAttribute('aria-expanded', 'true');
      }
    }
  }
}
function rechercherSalons() {
  throw new Error('Function not implemented.');
}

