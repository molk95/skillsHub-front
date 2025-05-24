import { Component, OnInit } from '@angular/core';
import { Community, CommunityCreateDto } from '../../models/communities.model';
import { Router, ActivatedRoute } from '@angular/router';
import { CommunityService } from '../../services/community.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-community-form',
  templateUrl:'./community-form.component.html'
})
export class CommunityFormComponent implements OnInit {
  community: CommunityCreateDto = {
    name: '',
    description: ''
  };
  isEditMode = false;
  communityId: string | null = null;
  isLoading = false;
  loadingMessage = '';

  constructor(
    private communityService: CommunityService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    console.log('CommunityFormComponent - Constructor');
  }

  ngOnInit(): void {
    console.log('CommunityFormComponent - ngOnInit');

    // Récupérer l'ID depuis la route
    this.communityId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.communityId;

    console.log('Community ID from route:', this.communityId);
    console.log('Is edit mode:', this.isEditMode);

    if (this.isEditMode && this.communityId) {
      console.log('Loading community for editing...');
      this.loadingMessage = 'Chargement des données de la communauté...';
      this.loadCommunity(this.communityId);
    } else {
      console.log('Creating new community - form ready');
      this.loadingMessage = 'Prêt pour créer une nouvelle communauté';
    }
  }

  loadCommunity(id: string): void {
    console.log('=== CHARGEMENT COMMUNAUTÉ ===');
    console.log('ID:', id);
    this.isLoading = true;
    this.loadingMessage = 'Chargement en cours...';

    this.communityService.getCommunityById(id).subscribe({
      next: (response: any) => {
        console.log('=== RÉPONSE REÇUE ===');
        console.log('Réponse complète:', response);
        this.isLoading = false;

        // Extraire les données de la réponse
        let name = '';
        let description = '';

        // Essayer toutes les structures possibles
        if (response?.data) {
          name = response.data.name || '';
          description = response.data.description || '';
        } else if (response?.name) {
          name = response.name || '';
          description = response.description || '';
        } else {
          // Chercher dans toute la structure
          const findData = (obj: any): any => {
            if (obj && typeof obj === 'object') {
              if (obj.name) return obj;
              for (const key in obj) {
                const result = findData(obj[key]);
                if (result) return result;
              }
            }
            return null;
          };

          const foundData = findData(response);
          if (foundData) {
            name = foundData.name || '';
            description = foundData.description || '';
          }
        }

        // Mettre à jour le formulaire
        this.community = {
          name: name,
          description: description
        };

        console.log('Données chargées:', { name, description });
      },
      error: (error) => {
        console.error('❌ Erreur API:', error);
        this.isLoading = false;
        this.loadingMessage = 'Erreur de chargement';

        // En cas d'erreur, utiliser des données de test
        this.community = {
          name: 'Erreur de chargement',
          description: 'Utilisez le bouton "Test API Direct" pour diagnostiquer'
        };
      }
    });
  }

  saveCommunity(): void {
    console.log('=== SAVE COMMUNITY APPELÉ ===');
    console.log('Current community data:', this.community);
    console.log('Nom:', this.community.name);
    console.log('Description:', this.community.description);
    console.log('Description length:', this.community.description?.length || 0);
    console.log('Description type:', typeof this.community.description);
    console.log('Is edit mode:', this.isEditMode);
    console.log('Community ID:', this.communityId);

    // Validation du nom (obligatoire)
    if (!this.community.name || this.community.name.trim() === '') {
      alert('❌ Le nom de la communauté est obligatoire !');
      return;
    }

    // Validation de la longueur du nom
    if (this.community.name.trim().length < 3) {
      alert('❌ Le nom doit contenir au moins 3 caractères !');
      return;
    }

    // Debug spécial pour la description
    console.log('=== DEBUG DESCRIPTION ===');
    console.log('Description brute:', JSON.stringify(this.community.description));
    console.log('Description existe?', !!this.community.description);
    console.log('Description vide?', this.community.description === '');
    console.log('Description undefined?', this.community.description === undefined);
    console.log('Description null?', this.community.description === null);

    if (this.isEditMode && this.communityId) {
      console.log('Updating community...');
      console.log('Community ID:', this.communityId);
      console.log('Data to update:', this.community);

      this.communityService.updateCommunity(this.communityId, this.community).subscribe({
        next: (response) => {
          console.log('Community updated successfully:', response);
          console.log('Updated data received:', response.data);

          // Vérifier si les données ont vraiment changé
          if (response.data) {
            console.log('New name:', response.data.name);
            console.log('New description:', response.data.description);
          }

          alert(`Communauté mise à jour avec succès !\nNouveau nom: ${response.data?.name}\nNouvelle description: ${response.data?.description}`);

          // Attendre un peu avant de rediriger pour laisser le temps au backend
          setTimeout(() => {
            this.router.navigate(['/communities']);
          }, 1000);
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour de la communauté:', error);
          alert('Erreur lors de la mise à jour: ' + error.message);
        }
      });
    } else {
      console.log('=== CRÉATION NOUVELLE COMMUNAUTÉ ===');
      console.log('Données à envoyer:', this.community);
      console.log('Nom:', this.community.name);
      console.log('Description:', this.community.description);

      this.communityService.createCommunity(this.community).subscribe({
        next: (response) => {
          console.log('=== COMMUNAUTÉ CRÉÉE ===');
          console.log('Réponse complète:', response);
          console.log('Données créées:', response.data);

          if (response.data) {
            console.log('Nom créé:', response.data.name);
            console.log('Description créée:', response.data.description);
          }

          alert(`Communauté créée avec succès !\nNom: ${response.data?.name}\nDescription: ${response.data?.description || 'Aucune'}`);
          this.router.navigate(['/communities']);
        },
        error: (error) => {
          console.error('Erreur lors de la création de la communauté:', error);
          alert('Erreur lors de la création: ' + error.message);
        }
      });
    }
  }

  testApiCall(): void {
    if (!this.communityId) return;

    console.log('=== TEST API DIRECT ===');
    const apiUrl = `http://localhost:3000/api/communities/${this.communityId}`;
    console.log('Testing direct API call to:', apiUrl);

    this.http.get(apiUrl).subscribe({
      next: (response: any) => {
        console.log('Direct API response:', response);
        console.log('Direct API response structure:', JSON.stringify(response, null, 2));
        alert(`API Test Result:\n${JSON.stringify(response, null, 2)}`);
      },
      error: (error) => {
        console.error('Direct API error:', error);
        alert(`API Test Error:\n${error.message}`);
      }
    });
  }

  forceTestData(): void {
    console.log('Forcing test data...');
    this.community = {
      name: 'discorddddddd',
      description: 'Ceci est une description de test pour vérifier que le formulaire fonctionne correctement.'
    };
    this.loadingMessage = 'Données de test forcées - Vous pouvez maintenant modifier';
    console.log('Test data set:', this.community);
  }

  reloadData(): void {
    if (this.communityId) {
      console.log('Reloading data...');
      this.loadingMessage = 'Rechargement...';
      this.loadCommunity(this.communityId);
    }
  }

  testCompleteFlow(): void {
    console.log('=== TEST COMPLET DU FLUX DE MODIFICATION ===');

    if (!this.communityId) {
      alert('Erreur: Pas d\'ID de communauté');
      return;
    }

    // Étape 1: Charger les données
    console.log('Étape 1: Chargement des données...');
    this.loadCommunity(this.communityId);

    // Étape 2: Attendre un peu puis modifier
    setTimeout(() => {
      console.log('Étape 2: Modification des données...');
      const timestamp = new Date().toLocaleTimeString();
      this.community = {
        name: `Test Modifié ${timestamp}`,
        description: `Description modifiée le ${timestamp}`
      };
      this.loadingMessage = 'Données de test modifiées - Prêt à sauvegarder';

      console.log('Données modifiées:', this.community);
      alert(`Test complet préparé!\nNom: ${this.community.name}\nDescription: ${this.community.description}\n\nCliquez sur "Mettre à jour" pour sauvegarder.`);
    }, 2000);
  }

  forceDescription(): void {
    console.log('=== FORCER DESCRIPTION ===');

    // Forcer une description de test
    this.community.description = 'Description forcée pour test - Vous pouvez maintenant la modifier';
    this.loadingMessage = 'Description forcée - Modifiez-la maintenant';

    console.log('Description forcée:', this.community.description);
    console.log('Objet community après forçage:', this.community);

    alert(`Description forcée!\nVous devriez maintenant voir:\n"${this.community.description}"\ndans le champ Description.`);
  }
}








