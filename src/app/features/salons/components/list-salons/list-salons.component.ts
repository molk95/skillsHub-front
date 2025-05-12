import { Component, OnInit } from '@angular/core';
import { ISalon } from '../../models/salons.model';
import { SalonsService } from '../../services/salons.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-salons',
  templateUrl: './list-salons.component.html',
  styleUrls: ['./list-salons.component.css']
})
export class ListSalonsComponent implements OnInit {
  salons: ISalon[] = [];  // Liste des salons
  salonSelectionne: ISalon | null = null;
  searchTerm: string = '';  // Pour la recherche par nom

  constructor(private salonService: SalonsService, private router: Router) {}
  ngOnInit(): void {
    this.chargerSalons();
  }

  // Charger tous les salons depuis le service
  chargerSalons(): void {
    console.log('Tentative de chargement des salons...');
    this.salonService.getAllSalons().subscribe({
      next: (data) => {
        console.log('Salons récupérés avec succès:', data);
        this.salons = data;
      },
      error: (err) => {
        console.error('Erreur détaillée lors du chargement des salons:', err);
        if (err.status === 0) {
          alert('Impossible de se connecter au serveur. Vérifiez que le backend est démarré et accessible.');
        } else {
          alert(`Erreur lors du chargement des salons: ${err.message || 'Erreur inconnue'}`);
        }
      }
    });
  }

  // Rechercher un salon par son nom
  rechercherSalons(): void {
    if (this.searchTerm.trim().length > 0) {
      this.salonService.getSalonByName(this.searchTerm).subscribe({
        next: (data) => {
          this.salons = data;
        },
        error: (err) => {
          console.error('Erreur lors de la recherche de salons', err);
          this.salons = [];  // vider la liste si rien trouvé
        }
      });
    } else {
      this.chargerSalons();  // Si la recherche est vide, charger tous les salons
    }
  }

  // Méthode pour mettre à jour un salon
  mettreAJourSalon(nom: string) {
    // Rediriger vers la page de mise à jour avec le nom du salon
    this.router.navigate(['/salons/update', nom]);
  }

// Méthode pour supprimer un salon
supprimerSalon(nom: string) {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le salon "${nom}" ?`)) {
    this.salonService.deleteSalonByName(nom).subscribe(
      () => {
        // Supprimez le salon localement après la suppression
        this.salons = this.salons.filter(salon => salon.nom !== nom);
        alert(`Le salon "${nom}" a été supprimé avec succès.`);
      },
      error => {
        console.error('Erreur lors de la suppression du salon :', error);
        alert(`Une erreur s'est produite lors de la suppression du salon "${nom}".`);
      }
    );
  }}}

