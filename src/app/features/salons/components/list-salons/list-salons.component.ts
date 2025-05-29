import { Component, OnInit } from '@angular/core';
import { SalonsService } from '../../services/salons.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-list-salons',
  templateUrl: './list-salons.component.html',
  styleUrls: ['./list-salons.component.css']
})
export class ListSalonsComponent implements OnInit {
supprimerSalon(arg0: any) {
throw new Error('Method not implemented.');
}
  salons: any[] = [];
  searchTerm: string = '';
  skillName: string = '';
  tutorName: string = '';

  constructor(
    private salonService: SalonsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer les paramètres de recherche depuis l'URL
    this.route.queryParams.subscribe(params => {
      this.skillName = params['skillName'] || '';
      this.tutorName = params['tutorName'] || '';
      
      // Si des paramètres sont présents, effectuer une recherche automatique
      if (this.skillName || this.tutorName) {
        // Construire le terme de recherche en combinant le nom de la compétence et le tuteur
        this.searchTerm = [this.skillName, this.tutorName].filter(Boolean).join(' ');
        console.log(`Recherche automatique avec le terme: "${this.searchTerm}"`);
        this.rechercherSalons();
      } else {
        // Sinon, charger tous les salons
        this.chargerSalons();
      }
    });
  }

  chargerSalons(): void {
    this.salonService.getAllSalons().subscribe({
      next: (data) => {
        console.log('Salons récupérés:', data);
        this.salons = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des salons:', err);
      }
    });
  }

  // Rechercher un salon par son nom
  rechercherSalons(): void {
    if (this.searchTerm.trim().length > 0) {
      this.salonService.getSalonByName(this.searchTerm).subscribe({
        next: (data) => {
          console.log('Résultats de la recherche:', data);
          this.salons = data;
          
          // Si aucun résultat n'est trouvé avec le terme exact, essayer une recherche plus large
          if (data.length === 0 && (this.skillName || this.tutorName)) {
            console.log('Aucun résultat trouvé, tentative de recherche plus large...');
            // Recherche par mots-clés individuels
            const keywords = this.searchTerm.split(' ').filter(Boolean);
            if (keywords.length > 1) {
              // Essayer avec chaque mot-clé séparément
              this.rechercherParMotsCles(keywords);
            }
          }
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

  // Méthode pour mettre à jour un salon
  mettreAJourSalon(nom: string) {
    // Rediriger vers la page de mise à jour avec le nom du salon
    this.router.navigate(['/salons/update', nom]);
  }
}
