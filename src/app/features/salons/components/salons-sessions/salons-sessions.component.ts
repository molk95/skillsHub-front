import { Component, OnInit } from '@angular/core';
import { SalonsService } from '../../services/salons.service';

@Component({
  selector: 'app-salons-sessions',
  templateUrl: './salons-sessions.component.html',
  styleUrls: ['./salons-sessions.component.css']
})
export class SalonsSessionsComponent implements OnInit {
  salons: any[] = [];  // Liste des salons avec leurs sessions
  searchTerm: string = '';  // Pour la recherche par nom

  constructor(private salonService: SalonsService) {}

  ngOnInit(): void {
    this.chargerSalonsAvecSessions();
  }

  // Charger tous les salons avec leurs sessions depuis le service
  chargerSalonsAvecSessions(): void {
    console.log('Tentative de chargement des salons avec leurs sessions...');
    this.salonService.getSalonsWithSessions().subscribe({
      next: (data) => {
        console.log('Salons avec sessions récupérés avec succès:', data);
        this.salons = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des salons avec sessions:', err);
        alert(`Erreur lors du chargement des salons : ${err.message || 'Erreur inconnue'}`);
      }
    });
  }

  // Rechercher un salon par son nom
  rechercherSalons(): void {
    if (this.searchTerm.trim().length > 0) {
      this.salons = this.salons.filter((salon) =>
        salon.salon.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.chargerSalonsAvecSessions();  // Si la recherche est vide, recharger tous les salons
    }
  }
}