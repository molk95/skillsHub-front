import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SalonsService } from '../../services/salons.service';
import { ISalon } from '../../models/salons.model';

@Component({
  selector: 'app-update-salons',
  templateUrl: './update-salons.component.html',
  styleUrls: ['./update-salons.component.css']
})
export class UpdateSalonsComponent implements OnInit {
  salonNom: string = '';               // Name of the salon to update
  nouvelleDescription: string = '';   // New description
  updatedSalon: ISalon | null = null; // Updated salon
  errorMessage: string = '';          // Error message

  constructor(
    private route: ActivatedRoute,
    private salonsService: SalonsService
  ) {}

  ngOnInit(): void {
    // Retrieve the salon name from the route parameters
    this.route.paramMap.subscribe(params => {
      this.salonNom = params.get('nom') || '';
      console.log('Salon name retrieved from URL:', this.salonNom);
    });
  }

  updateSalon(): void {
    if (!this.nouvelleDescription.trim()) {
      this.errorMessage = 'La description ne peut pas être vide.';
      return;
    }
  
    const salonData = { description: this.nouvelleDescription }; // Seule la description est envoyée
    console.log('Nom envoyé au backend :', this.salonNom);
    console.log('Données envoyées au backend :', salonData);
  
    this.salonsService.updateSalonByName(this.salonNom, salonData).subscribe({
      next: (updatedSalon) => {
        console.log('Salon mis à jour avec succès :', updatedSalon);
        this.updatedSalon = updatedSalon;
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour :', err);
        this.errorMessage = err.error?.message || 'Erreur inconnue lors de la mise à jour.';
      }
    });
  }
}