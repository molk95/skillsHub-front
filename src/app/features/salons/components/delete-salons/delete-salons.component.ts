import { Component } from '@angular/core';
import { SalonsService } from '../../services/salons.service';
import { ISalon } from '../../models/salons.model';

@Component({
  selector: 'app-delete-salons',
  templateUrl: './delete-salons.component.html',
  styleUrls: ['./delete-salons.component.css']
})
export class DeleteSalonsComponent {
  salonNom: string = '';         // Nom du salon à supprimer
  errorMessage: string = '';     // Message d'erreur s'il y en a
  successMessage: string = '';   // Message de succès après suppression

  constructor(private salonsService: SalonsService) {}

  // Méthode pour supprimer un salon
  deleteSalon(): void {
    if (this.salonNom) {
      this.salonsService.deleteSalonByName(this.salonNom).subscribe({
        next: () => {
          this.successMessage = 'Salon supprimé avec succès';
          this.errorMessage = '';  // Réinitialiser le message d'erreur
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la suppression du salon';
          this.successMessage = ''; // Réinitialiser le message de succès
          console.error(err);
        }
      });
    } else {
      this.errorMessage = 'Veuillez entrer un nom de salon à supprimer';
    }
  }
}
