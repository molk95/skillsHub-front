import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunityService } from '../../services/community.service';
import { Community } from '../../models/communities.model';
import { Observable } from 'rxjs/internal/Observable';
import { ApiResponse } from 'src/app/core/models/api-response';
import { Forum } from 'src/app/features/forums/models/forums.model';
import { ForumService } from 'src/app/features/forums/service/forum.service';
import { from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-community-details',
  templateUrl: './community-details.component.html',
  styleUrls: []
})
export class CommunityDetailsComponent implements OnInit {
  community: Community | null = null;
  loading = false;
  loadingMembers = false;
  error = '';
  isCreator = false;
  isMember = false;
  showMembers = false;
  currentUserId = '';
  communityForums: Forum[] = [];

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private communityService: CommunityService,
    private forumService: ForumService
  ) { }

  ngOnInit(): void {
    // Récupérer l'ID de l'utilisateur connecté
    this.currentUserId = this.communityService.getCurrentUserId();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadCommunity(id);
      }
    });
  }

  logResponseDetails(response: any): void {
    console.log('Response type:', typeof response);
    console.log('Response keys:', Object.keys(response));
    console.log('Response JSON:', JSON.stringify(response, null, 2));

    if (response.data) {
      console.log('Data type:', typeof response.data);
      console.log('Data keys:', Object.keys(response.data));
    }
  }

  loadCommunity(id: string): void {
    this.loading = true;
    this.error = '';
    console.log(`Loading community with ID: ${id}`);

    this.communityService.getCommunityById(id)
      .subscribe({
        next: (response) => {
          console.log('Community data received:', response);
          this.logResponseDetails(response);

          // Vérifier si la réponse est valide
          if (!response) {
            this.error = 'Données de communauté invalides ou vides';
            console.error('Invalid community data:', response);
            this.loading = false;
            return;
          }

          // Assigner la communauté en fonction du format de la réponse
          if (response.data) {
            // Format avec wrapper data
            this.community = response.data;
          } else {
            // Format direct sans wrapper
            this.community = response.data;
          }

          // Vérifier que l'ID est bien présent
          if (!this.community?._id) {
            console.warn('Community loaded without _id:', this.community);
            // Si l'ID n'est pas dans _id, essayons de l'utiliser depuis l'URL
            if (this.community) {
              this.community._id = id;
            }
          }

          console.log('Community object set:', this.community);

          // Vérifier si l'utilisateur est le créateur
          this.isCreator = this.community?.creator === this.currentUserId;

          // Vérifier si l'utilisateur est membre
          this.isMember = this.community && Array.isArray(this.community.members) &&
            this.community.members.some(member => {
              if (!member) return false;
              const memberId = typeof member === 'string' ? member : member._id;
              return memberId === this.currentUserId;
            }) || false;

          this.loading = false;

          // Charger les forums seulement après que la communauté soit complètement chargée
          if (this.community && this.community._id) {
            this.loadCommunityForums();
          }
        },
        error: (err) => {
          this.error = `Erreur lors du chargement de la communauté: ${err.message || 'Erreur inconnue'}`;
          console.error('API Error:', err);
          this.loading = false;
        }
      });
  }

  joinCommunity(): void {
    if (!this.community?._id) return;

    this.communityService.joinCommunity(this.community._id)
      .subscribe({
        next: (response) => {
          this.community = response.data;
          this.isMember = true;
        },
        error: (err) => {
          this.error = 'Erreur lors de la tentative de rejoindre la communauté';
          console.error(err);
        }
      });
  }

  leaveCommunity(): void {
    if (!this.community?._id) return;

    this.communityService.leaveCommunity(this.community._id)
      .subscribe({
        next: (response) => {
          this.community = response.data;
          this.isMember = false;
        },
        error: (err) => {
          this.error = 'Erreur lors de la tentative de quitter la communauté';
          console.error(err);
        }
      });
  }

  editCommunity(): void {
    if (!this.community?._id) return;
    this.router.navigate(['/communities/edit', this.community._id]);
  }

  deleteCommunity(): void {
    if (!this.community?._id || !confirm('Êtes-vous sûr de vouloir supprimer cette communauté ?')) return;

    this.communityService.deleteCommunity(this.community._id)
      .subscribe({
        next: () => {
          this.router.navigate(['/communities']);
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression de la communauté';
          console.error(err);
        }
      });
  }

  // Méthodes pour l'affichage des membres
  getMemberInitials(member: any): string {
    if (typeof member === 'string') return '?';

    const fullName = member.fullName || '';
    if (!fullName) return '?';

    const names = fullName.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return fullName[0].toUpperCase();
  }

  getMemberName(member: any): string {
    if (typeof member === 'string') return 'Utilisateur';
    return member.fullName || 'Utilisateur';
  }

  isCreatorMember(member: any): boolean {
    if (!this.community) return false;

    const memberId = typeof member === 'string' ? member : member._id;
    const creatorId = typeof this.community.creator === 'string'
      ? this.community.creator
      : this.community.creator?._id;

    return memberId === creatorId;
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

// 1. Système de votes/likes pour les forums
likeForumPost(forumId: string): void {
  if (!forumId) {
    console.error('ID du forum manquant');
    return;
  }

  // Trouver le forum dans la liste
  const forumIndex = this.communityForums.findIndex(forum => forum.id === forumId);
  if (forumIndex === -1) {
    console.error('Forum non trouvé dans la liste');
    return;
  }

  // Initialiser le compteur de likes si nécessaire
  if (this.communityForums[forumIndex].likeCount === undefined) {
    this.communityForums[forumIndex].likeCount = 0;
  }

  // Incrémenter le compteur de likes
  this.communityForums[forumIndex].likeCount!++;

  // Afficher une notification temporaire
  const likeCount = this.communityForums[forumIndex].likeCount;
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50 notification-enter';
  notification.innerHTML = `
    <div class="flex items-center">
      <i class="bi bi-heart-fill mr-2"></i>
      <span>J'aime ajouté ! Total: ${likeCount}</span>
    </div>
  `;
  document.body.appendChild(notification);

  // Supprimer la notification après 3 secondes
  setTimeout(() => {
    notification.classList.remove('notification-enter');
    notification.classList.add('notification-exit');
    setTimeout(() => notification.remove(), 500);
  }, 2000);

  // Appeler le service pour mettre à jour le like (simulation pour l'instant)
  from(this.forumService.getForumById(forumId)).pipe(
    map(forum => ({ success: true, data: forum } as ApiResponse<Forum>)),
    catchError(error => throwError(() => error))
  ).subscribe({
    next: (response) => {
      console.log('Like ajouté avec succès', response);
    },
    error: (err) => {
      console.error('Erreur lors de l\'ajout du like', err);
      // Annuler l'incrémentation en cas d'erreur
      this.communityForums[forumIndex].likeCount!--;
    }
  });
}

// 2. Marquer un forum comme favori
bookmarkForum(forumId: string): void {
  if (!forumId) {
    console.error('ID du forum manquant');
    return;
  }

  // Trouver le forum dans la liste
  const forumIndex = this.communityForums.findIndex(forum => forum.id === forumId);
  if (forumIndex === -1) {
    console.error('Forum non trouvé dans la liste');
    return;
  }

  // Appeler le service pour marquer comme favori (simulation pour l'instant)
  from(this.forumService.getForumById(forumId)).pipe(
    map(forum => ({ success: true, data: forum } as ApiResponse<any>)),
    catchError(error => throwError(() => error))
  ).subscribe({
    next: (response) => {
      console.log('Forum marqué comme favori avec succès', response);
      // Afficher un message de confirmation
      alert('Forum ajouté aux favoris');
    },
    error: (err) => {
      console.error('Erreur lors de l\'ajout aux favoris', err);
    }
  });
}

// 3. Signaler un contenu inapproprié
reportForum(forumId: string, reason: string): void {
  if (!forumId) {
    console.error('ID du forum manquant');
    return;
  }

  // Trouver le forum dans la liste
  const forumIndex = this.communityForums.findIndex(forum => forum.id === forumId);
  if (forumIndex === -1) {
    console.error('Forum non trouvé dans la liste');
    return;
  }

  // Appeler le service pour signaler le forum (simulation pour l'instant)
  from(this.forumService.getForumById(forumId)).pipe(
    map(forum => ({ success: true, data: forum } as ApiResponse<any>)),
    catchError(error => throwError(() => error))
  ).subscribe({
    next: (response) => {
      console.log('Forum signalé avec succès', response);
      console.log('Raison du signalement:', reason);
      // Afficher un message de confirmation
      alert('Forum signalé avec succès');
    },
    error: (err) => {
      console.error('Erreur lors du signalement du forum', err);
    }
  });
}

// 4. Système de tags/catégories pour les forum
getForumsByTag(tag: string): Observable<ApiResponse<Forum[]>> {
  return from(this.forumService.getForumsByTag(tag)).pipe(
    map(forums => ({ success: true, data: forums || [] } as ApiResponse<Forum[]>)),
    catchError(error => throwError(() => error))
  );
}

// Méthode pour naviguer vers les détails d'un forum
navigateToForumDetails(forumId: string): void {
  if (!forumId) {
    console.error('ID du forum manquant');
    return;
  }
  this.router.navigate(['/forums/details', forumId]);
}

// Méthode pour naviguer vers la page d'affichage des forums
navigateToForums(): void {
  console.log('Navigation vers la page des forums');
  this.router.navigate(['/forums']);
}

// Méthode pour créer un nouveau forum dans cette communauté
createForumInCommunity(): void {
  // Vérifier si la communauté est chargée
  if (!this.community) {
    console.error('Objet communauté non disponible');
    this.error = 'Impossible de créer un forum : communauté non chargée';
    return;
  }

  // Récupérer l'ID de la communauté
  const communityId = this.community._id;
  if (!communityId) {
    console.error('ID de la communauté manquant', this.community);
    this.error = 'Impossible de créer un forum : ID de communauté manquant';
    return;
  }

  console.log('Création d\'un forum pour la communauté:', communityId);

  // Naviguer vers la page de création de forum avec l'ID de la communauté pré-rempli
  this.router.navigate(['/forums/add'], {
    queryParams: { communityId: communityId }
  });
}

// Méthode pour charger les forums de la communauté
loadCommunityForums(): void {
  if (!this.community || !this.community._id) {
    console.error('Communauté non disponible ou ID manquant', this.community);
    this.error = 'Impossible de charger les forums : communauté non chargée ou ID manquant';
    return;
  }

  console.log('Chargement des forums pour la communauté:', this.community._id);

  this.loading = true;
  this.forumService.getForumsByTag(this.community._id)
    .then(forums => {
      // S'assurer que tous les forums ont des compteurs initialisés et sont triés par date
      this.communityForums = (forums || [])
        .map(forum => {
          // Créer une copie du forum pour éviter de modifier l'original
          const updatedForum = { ...forum };

          // Initialiser les compteurs s'ils n'existent pas
          if (updatedForum.viewCount === undefined) {
            // Générer un nombre aléatoire entre 10 et 100 pour les vues
            updatedForum.viewCount = 10 + Math.floor(Math.random() * 90);
          }

          if (updatedForum.likeCount === undefined) {
            // Générer un nombre aléatoire entre 0 et 30 pour les likes
            updatedForum.likeCount = Math.floor(Math.random() * 30);
          }

          // Assurer que les compteurs sont des nombres
          updatedForum.viewCount = Number(updatedForum.viewCount);
          updatedForum.likeCount = Number(updatedForum.likeCount);

          return updatedForum;
        })
        // Trier les forums par date de création (du plus récent au plus ancien)
        .sort((a, b) => {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          return dateB - dateA; // Ordre décroissant (plus récent en premier)
        });

      console.log('Forums de la communauté chargés avec compteurs initialisés:', this.communityForums);
      this.loading = false;

      // Afficher une notification de succès
      if (this.communityForums.length > 0) {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-lg z-50';
        notification.innerHTML = `
          <div class="flex items-center">
            <i class="bi bi-check-circle-fill mr-2"></i>
            <span>${this.communityForums.length} forums chargés</span>
          </div>
        `;
        document.body.appendChild(notification);

        // Supprimer la notification après 3 secondes
        setTimeout(() => {
          notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
          setTimeout(() => notification.remove(), 500);
        }, 3000);
      }
    })
    .catch(err => {
      console.error('Erreur lors du chargement des forums:', err);
      this.error = 'Erreur lors du chargement des forums';
      this.loading = false;
    });
}
}






















