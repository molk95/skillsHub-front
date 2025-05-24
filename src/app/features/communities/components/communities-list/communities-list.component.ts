import { Component, OnInit } from '@angular/core';
import { CommunityService } from '../../services/community.service';
import { Community, CommunityCreateDto } from '../../models/communities.model';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-communities-list',
  templateUrl: './communities-list.component.html'
})
export class CommunitiesListComponent implements OnInit {
  communities: Community[] = [];
  filteredCommunities: Community[] = [];
  loading = false;
  error = '';
  searchControl = new FormControl('');

  // Track membership status for each community
  communityMemberships: Map<string, boolean> = new Map();

  constructor(private communityService: CommunityService, private router: Router) { }

  ngOnInit(): void {
    console.log('CommunitiesListComponent - ngOnInit - Rechargement de la liste');

    // Charger d'abord toutes les communautés
    this.loadCommunities();

    // Initialiser le formulaire de recherche
    this.searchControl = new FormControl('');

    // S'abonner aux changements de la recherche avec un délai
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      console.log('Search value changed:', value);
      console.log('Available communities for search:', this.communities.length);
      this.filterCommunities(value);
    });
  }

  // Nouvelle méthode simplifiée pour filtrer les communautés
  filterCommunities(query: string | null): void {
    if (!query || query.trim() === '') {
      this.filteredCommunities = [...this.communities];
      console.log('Empty search, showing all communities:', this.communities.length);
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    console.log('Filtering for term:', searchTerm);

    this.filteredCommunities = this.communities.filter(community => {
      // Vérifier si le nom contient le terme de recherche
      const nameMatch = community.name &&
                       community.name.toLowerCase().includes(searchTerm);

      // Vérifier si la description contient le terme de recherche
      const descMatch = community.description !== undefined ? community.description.toLowerCase().includes(searchTerm) : false;

      // Vérifier si les tags contiennent le terme de recherche
      let tagMatch = false;
      if (Array.isArray(community.tags)) {
        tagMatch = community.tags.some(tag =>
          tag && tag.toLowerCase().includes(searchTerm)
        );
      } else if (typeof community.tags === 'string') {
        tagMatch = community.tags !== undefined && typeof community.tags === 'string' && (community.tags as unknown as string).toLowerCase().includes(searchTerm);
      }

      return nameMatch || descMatch || tagMatch;
    });

    console.log(`Filter found ${this.filteredCommunities.length} results`);
  }

  loadCommunities(): void {
    this.loading = true;
    this.error = '';
    console.log('Loading communities...');

    this.communityService.getAllCommunities()
      .subscribe({
        next: (response) => {
          console.log('API response received:', response);

          // Traiter la réponse selon sa structure
          if (Array.isArray(response)) {
            // Si la réponse est directement un tableau
            this.communities = response;
          } else if (response && response.data && Array.isArray(response.data)) {
            // Si la réponse est un objet avec une propriété data qui est un tableau
            this.communities = response.data;
          } else if (response && response.success && Array.isArray(response.data)) {
            // Format API avec success et data
            this.communities = response.data;
          } else {
            console.error('Unexpected API response format:', response);
            this.error = 'Format de réponse inattendu';
            this.communities = [];
          }

          // Apply any active search filter
          this.filterCommunities(this.searchControl.value);

          // Check membership status for all communities
          this.checkMemberships();

          this.loading = false;
        },
        error: (err) => {
          console.error('API Error:', err);
          this.error = 'Erreur lors du chargement des communautés';
          this.loading = false;
        }
      });
  }

  joinCommunity(communityId: string): void {
    if (!communityId) {
      console.error('ID de communauté invalide');
      return;
    }

    console.log('Tentative de rejoindre la communauté:', communityId);

    this.communityService.joinCommunity(communityId)
      .subscribe({
        next: (response) => {
          console.log('Communauté rejointe avec succès:', response);
          // Update local membership status
          this.communityMemberships.set(communityId, true);
          // Reload communities to update counts
          this.loadCommunities();
        },
        error: (err) => {
          console.error('Join error:', err);
          // Afficher un message d'erreur à l'utilisateur
          this.error = 'Erreur lors de la tentative de rejoindre la communauté';
        }
      });
  }

  leaveCommunity(communityId: string): void {
    if (!communityId) {
      console.error('ID de communauté invalide');
      return;
    }

    console.log('Tentative de quitter la communauté:', communityId);

    this.communityService.leaveCommunity(communityId)
      .subscribe({
        next: (response) => {
          console.log('Communauté quittée avec succès:', response);
          // Update local membership status
          this.communityMemberships.set(communityId, false);
          // Reload communities to update counts
          this.loadCommunities();
        },
        error: (err) => {
          console.error('Leave error:', err);
        }
      });
  }

  searchCommunities(query: string): void {
    console.log('Searching for:', query);
    if (!query || query.trim() === '') {
      this.filteredCommunities = [...this.communities];
      return;
    }

    // Utiliser la recherche côté client en attendant que le backend soit corrigé
    this.filterCommunities(query);

    /* Commentez temporairement la recherche côté serveur
    this.loading = true;
    this.error = '';

    this.communityService.searchCommunities(query)
      .subscribe({
        next: (response) => {
          console.log('Search response:', response);
          if (response && response.data) {
            this.filteredCommunities = response.data;
          } else {
            this.filteredCommunities = [];
            this.error = 'Aucun résultat trouvé';
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Search error:', err);
          this.error = 'Erreur lors de la recherche';
          this.filteredCommunities = [];
          this.loading = false;
        }
      });
    */
  }

  createNewCommunity(): void {
    // Au lieu de créer directement, redirigez vers la page de création
    this.router.navigate(['/communities/create']);
  }

  viewCommunityDetails(communityId: string): void {
    if (!communityId) {
      console.error('ID de communauté invalide');
      return;
    }
    console.log('Navigation vers les détails de la communauté:', communityId);
    this.router.navigate(['/communities/details', communityId]);
  }

  getCurrentUserId(): string {
    return this.communityService.getCurrentUserId();
  }

  getCreatorId(creator: any): string {
    if (typeof creator === 'string') {
      return creator;
    }
    return creator?._id || '';
  }

  editCommunity(communityId: string): void {
    console.log('editCommunity appelée avec ID:', communityId);
    if (!communityId) {
      console.error('ID de communauté invalide');
      return;
    }
    console.log('Navigation vers l\'édition de la communauté:', communityId);
    this.router.navigate(['/communities/edit', communityId]);
  }

  deleteCommunity(communityId: string, communityName: string): void {
    console.log('deleteCommunity appelée avec ID:', communityId, 'et nom:', communityName);
    if (!communityId) {
      console.error('ID de communauté invalide');
      return;
    }

    const confirmMessage = `Êtes-vous sûr de vouloir supprimer la communauté "${communityName}" ? Cette action est irréversible.`;
    if (confirm(confirmMessage)) {
      console.log('Suppression confirmée pour la communauté:', communityId);

      this.communityService.deleteCommunity(communityId).subscribe({
        next: (response) => {
          console.log('Communauté supprimée avec succès:', response);
          // Recharger la liste des communautés
          this.loadCommunities();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de la communauté:', error);
          this.error = 'Erreur lors de la suppression de la communauté';
        }
      });
    } else {
      console.log('Suppression annulée par l\'utilisateur');
    }
  }

  // Check if the current user is a member of a community
  isMember(community: Community): boolean {
    if (!community._id) return false;
    return this.communityMemberships.get(community._id) || false;
  }

  // Check membership status for all communities
  checkMemberships(): void {
    const userId = this.communityService.getCurrentUserId();
    if (!userId) return;

    this.communities.forEach(community => {
      if (community._id) {
        this.communityService.isUserMember(community._id, userId)
          .subscribe({
            next: (response) => {
              if (response && response.data !== undefined) {
                this.communityMemberships.set(community._id || '', response.data);
              }
            },
            error: (err) => {
              console.error('Error checking membership:', err);
            }
          });
      }
    });
  }

  getTagsArray(tags: string[] | string | undefined): string[] {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    return [tags]; // Convert single string to array
  }



  isCreator(community: Community): boolean {
    const userId = this.communityService.getCurrentUserId();
    if (!userId || !community.creator) return false;

    // Gérer les différents formats de creator (string ou objet)
    const creatorId = typeof community.creator === 'string'
      ? community.creator
      : community.creator._id;

    return creatorId === userId;
  }

  debugCommunity(community: Community): void {
    console.log('=== DEBUG COMMUNITY ===');
    console.log('Community object:', community);
    console.log('Community ID:', community._id);
    console.log('Community name:', community.name);
    console.log('Community creator:', community.creator);
    console.log('Current user ID:', this.communityService.getCurrentUserId());
    console.log('Is creator?', this.isCreator(community));
    console.log('Is member?', this.isMember(community));
    console.log('========================');

    // Afficher aussi dans une alerte pour l'utilisateur
    alert(`Debug Info:
ID: ${community._id}
Nom: ${community.name}
Créateur: ${JSON.stringify(community.creator)}
User actuel: ${this.communityService.getCurrentUserId()}
Est créateur: ${this.isCreator(community)}
Est membre: ${this.isMember(community)}`);
  }

  testNavigation(communityId: string): void {
    console.log('=== TEST NAVIGATION ===');
    console.log('Community ID:', communityId);
    console.log('Current route:', this.router.url);
    console.log('Attempting navigation to:', `/communities/edit/${communityId}`);

    if (!communityId) {
      alert('Erreur: ID de communauté manquant');
      return;
    }

    // Test de navigation avec gestion d'erreur
    this.router.navigate(['/communities/edit', communityId])
      .then(success => {
        console.log('Navigation success:', success);
        if (!success) {
          alert('Erreur: Navigation échouée');
        }
      })
      .catch(error => {
        console.error('Navigation error:', error);
        alert('Erreur de navigation: ' + error.message);
      });
  }

  forceReload(): void {
    console.log('=== FORCE RELOAD ===');
    console.log('Rechargement forcé de la liste des communautés');
    this.loading = true;
    this.error = '';

    // Vider les données actuelles
    this.communities = [];
    this.filteredCommunities = [];
    this.communityMemberships.clear();

    // Recharger
    this.loadCommunities();
  }

  // Méthode de debug pour voir les clés des objets
  getObjectKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }

  // Méthode pour générer une description par défaut
  getDefaultDescription(communityName: string): string {
    const descriptions = [
      `Rejoignez ${communityName} pour partager vos connaissances et apprendre ensemble.`,
      `${communityName} est une communauté dynamique dédiée au partage d'expériences.`,
      `Découvrez ${communityName}, un espace d'échange et de collaboration.`,
      `${communityName} rassemble des passionnés pour apprendre et grandir ensemble.`,
      `Participez à ${communityName} et développez vos compétences avec d'autres membres.`
    ];

    // Utiliser le hash du nom pour avoir une description cohérente
    const hash = communityName.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);

    return descriptions[Math.abs(hash) % descriptions.length];
  }


}


























































