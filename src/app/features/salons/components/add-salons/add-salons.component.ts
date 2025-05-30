import { Component, OnInit } from '@angular/core';
import { SalonsService } from '../../services/salons.service';
import { ISalon } from '../../models/salons.model';
import { Router } from '@angular/router';

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
  showListSalons = false;

  constructor(
    private salonsService: SalonsService,
    private router: Router // Injecter le Router
  ) {}

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
        // Rediriger vers la liste des salons après l'ajout
        this.router.navigate(['/salons/list']);
      },
      error: (err) => {
        console.error('Erreur lors de la création du salon', err);
        this.isLoading = false;
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
