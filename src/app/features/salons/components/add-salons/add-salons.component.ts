import { Component, OnInit } from '@angular/core';
import { SalonsService } from '../../services/salons.service';
import { ISalon } from '../../models/salons.model';

@Component({
  selector: 'app-add-salons',
  templateUrl: './add-salons.component.html',
  styleUrls: ['./add-salons.component.css']
})
export class AddSalonsComponent implements OnInit {
  salons: ISalon[] = [];
  newSalon: ISalon = {
    nom: '',
    description: '',
    dateCreation: new Date(),
    createurId: '662fc87dfc1a0d3d48f6a1b4',
  };
  isLoading = false;
  searchTerm: string = '';
  showListSalons = false;  // Variable pour gérer l'affichage de la liste des salons

  constructor(private salonsService: SalonsService) {}

  ngOnInit(): void {
    this.chargerSalons();
  }

  // Charger les salons existants
  chargerSalons(): void {
    this.salonsService.getAllSalons().subscribe({
      next: (data) => {
        this.salons = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des salons', err);
      }
    });
  }

  // Ajouter un salon
  ajouterSalon(): void {
    this.isLoading = true;

    this.salonsService.addSalon(this.newSalon).subscribe({
      next: (salon) => {
        this.salons.push(salon);
        this.resetForm();
      },
      error: (err) => {
        console.error('Erreur lors de la création du salon', err);
      },
      complete: () => {
        this.isLoading = false;
        this.showListSalons = true;  // Afficher la liste après ajout
      }
    });
  }

  // Réinitialiser le formulaire après l'ajout
  resetForm(): void {
    this.newSalon = {
      nom: '',
      description: '',
      dateCreation: new Date(),
      createurId: '662fc87dfc1a0d3d48f6a1b4',
    };
  }

  // Rechercher des salons par nom
  rechercherSalons(): void {
    if (this.searchTerm.trim().length > 0) {
      this.salonsService.getSalonByName(this.searchTerm).subscribe({
        next: (data) => {
          this.salons = data;
        },
        error: (err) => {
          console.error('Erreur lors de la recherche de salons', err);
          this.salons = [];
        }
      });
    } else {
      this.chargerSalons();
    }
  }
}
