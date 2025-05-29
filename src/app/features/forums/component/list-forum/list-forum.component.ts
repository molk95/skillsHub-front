import { Component, OnInit } from '@angular/core';
import { ForumService } from '../../service/forum.service';
import { Forum } from '../../models/forums.model';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { PermissionService, UserPermissions } from '../../../../core/services/permission.service';

@Component({
  selector: 'app-forums-list',
  templateUrl: './list-forum.component.html',
  styleUrls: ['./list-forum.component.css']
})
export class ForumsListComponent implements OnInit {
  forums: Forum[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  currentUserId: string = ''; // À récupérer depuis votre service d'authentification
  displayLimit: number = 100; // Augmenter la limite pour afficher tous les forums
  // Map pour stocker les noms d'auteurs par ID
  authorNames: Map<string, string> = new Map();
  // Permissions de l'utilisateur
  userPermissions: UserPermissions | null = null;
  currentCommunityId: string = ''; // ID de la communauté actuelle

  constructor(
    private forumService: ForumService,
    private router: Router,
    private userService: UserService,
    private permissionService: PermissionService
  ) {
    // Récupérer l'ID de l'utilisateur connecté depuis localStorage
    this.currentUserId = localStorage.getItem('userId') || '';
    // Pour les tests, utiliser un ID par défaut si pas d'utilisateur connecté
    if (!this.currentUserId) {
      this.currentUserId = '6803a7cf30943db1a68ebb11'; // ID de test
    }
  }

  ngOnInit(): void {
    this.loadForums();
    this.loadUserPermissions();
  }

  // Charger tous les forums
  loadForums(): void {
    this.isLoading = true;
    this.errorMessage = null;

    // Ajouter des forums fictifs pour le développement avec des IDs d'utilisateurs réels
    const mockForums: Forum[] = [
      {
        id: '1',
        title: 'Forum de test 1',
        author: '6803a7cf30943db1a68ebb11', // ID de "amir test"
        content: 'Contenu du forum de test 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        comments: [],
        created_at: new Date().toISOString(),
        community: '1',
        ratings: [],
        viewCount: 120,
        likeCount: 45
      },
      {
        id: '2',
        title: 'Forum de test 2',
        author: '6803aae6e3cbb91a78c195bd', // ID de "yassine benaoun test555"
        content: 'Contenu du forum de test 2. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        comments: [],
        created_at: new Date(Date.now() - 86400000).toISOString(), // Hier
        community: '1',
        ratings: [],
        viewCount: 85,
        likeCount: 32
      },
      {
        id: '3',
        title: 'Forum de test 3',
        author: '680bc3701cafa75c695bac60', // ID de "Chayma samaali"
        content: 'Contenu du forum de test 3. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
        comments: [],
        created_at: new Date(Date.now() - 172800000).toISOString(), // Avant-hier
        community: '2',
        ratings: [],
        viewCount: 65,
        likeCount: 18
      }
    ];

    // Essayer de charger les forums depuis l'API
    this.forumService.getAllForums()
      .then((data: Forum[] | undefined) => {
        // Combiner les forums de l'API avec les forums fictifs
        let apiForums: Forum[] = [];
        if (data && data.length > 0) {
          apiForums = data;
          console.log('Forums chargés depuis l\'API:', apiForums);
        }

        // Combiner les forums de l'API avec les forums fictifs
        this.forums = [...apiForums, ...mockForums];
        console.log('Tous les forums combinés:', this.forums);

        // Supprimer les doublons potentiels (basés sur l'ID)
        const uniqueForumIds = new Set();
        this.forums = this.forums.filter(forum => {
          if (forum.id && uniqueForumIds.has(forum.id)) {
            return false;
          }
          if (forum.id) {
            uniqueForumIds.add(forum.id);
          }
          return true;
        });

        // Ajouter des propriétés temporaires pour les compteurs si elles n'existent pas
        this.forums = this.forums.map(forum => ({
          ...forum,
          viewCount: forum.viewCount || Math.floor(Math.random() * 100), // Temporaire: à remplacer par les vraies données
          likeCount: forum.likeCount || Math.floor(Math.random() * 50)   // Temporaire: à remplacer par les vraies données
        }));

        // Trier les forums par date de création (le plus récent en premier)
        this.forums.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        // Charger les noms des auteurs
        this.loadAuthorNames();

        this.isLoading = false;
      })
      .catch(error => {
        // En cas d'erreur, utiliser les forums fictifs
        this.forums = mockForums;
        console.log('Erreur lors du chargement des forums, utilisation des forums fictifs:', error);

        // Trier les forums par date de création (le plus récent en premier)
        this.forums.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        this.isLoading = false;
      });
  }

  // Vérifier si l'utilisateur est le créateur du forum
  isForumCreator(forum: Forum): boolean {
    return forum.author === this.currentUserId;
  }

  // Vérifier si l'utilisateur est membre du forum
  isForumMember(forum: Forum): boolean {
    return forum.participants?.includes(this.currentUserId) || false;
  }

  // Aimer un forum
  likeForum(id: string): void {
    if (!id) {
      this.errorMessage = 'ID du forum invalide';
      return;
    }

    // Trouver le forum dans la liste
    const forumIndex = this.forums.findIndex(f => f.id === id);
    if (forumIndex === -1) {
      this.errorMessage = 'Forum introuvable';
      return;
    }

    // Incrémenter le compteur de likes (temporaire, à remplacer par un appel API)
    this.forums[forumIndex].likeCount = (this.forums[forumIndex].likeCount || 0) + 1;

    // Afficher un message de succès
    this.successMessage = 'Vous avez aimé ce forum';
    setTimeout(() => {
      this.successMessage = null;
    }, 3000);

    // TODO: Implémenter l'appel API pour enregistrer le like
    console.log('Like du forum avec ID:', id);
  }

  // Charger plus de forums
  loadMoreForums(): void {
    this.displayLimit += 6;
  }

  // Naviguer vers la page d'édition
  editForum(id: string): void {
    if (!id) {
      this.errorMessage = 'ID du forum invalide';
      return;
    }
    this.router.navigate(['/forums/edit', id]);
  }

  // Confirmer la suppression
  confirmDelete(id: string): void {
    if (!id) {
      this.errorMessage = 'ID du forum invalide';
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer ce forum ? Cette action est irréversible.')) {
      this.deleteForum(id);
    }
  }

  // Supprimer un forum
  deleteForum(id: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.forumService.deleteForum(id)
      .then(() => {
        // Mettre à jour la liste locale
        this.forums = this.forums.filter(forum => forum.id !== id);
        this.successMessage = 'Forum supprimé avec succès';
        this.isLoading = false;

        // Afficher un message de succès temporaire
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      })
      .catch(error => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors de la suppression du forum';
        console.error('Erreur lors de la suppression du forum:', error);
      });
  }

  // Naviguer vers la page d'ajout
  goToAddForum(): void {
    this.router.navigate(['/forums/add']);
  }

  // Charger les permissions de l'utilisateur
  loadUserPermissions(): void {
    if (this.currentCommunityId) {
      this.permissionService.getUserPermissionsForCommunity(this.currentUserId, this.currentCommunityId)
        .subscribe({
          next: (permissions) => {
            this.userPermissions = permissions;
          },
          error: (error) => {
            console.error('Erreur lors du chargement des permissions:', error);
          }
        });
    }
  }

  // Vérifier si l'utilisateur peut créer un forum
  canCreateForum(): boolean {
    return this.userPermissions?.canCreateForum || false;
  }

  // Vérifier si l'utilisateur peut modifier un forum
  canModifyForum(forum: Forum): boolean {
    if (!this.userPermissions) return false;

    // L'utilisateur peut toujours modifier ses propres forums
    if (this.isForumCreator(forum)) {
      return true;
    }

    // Sinon, vérifier les permissions générales
    return this.userPermissions.canModifyForum;
  }

  // Vérifier si l'utilisateur peut supprimer un forum
  canDeleteForum(forum: Forum): boolean {
    if (!this.userPermissions) return false;

    // L'utilisateur peut toujours supprimer ses propres forums
    if (this.isForumCreator(forum)) {
      return true;
    }

    // Sinon, vérifier les permissions générales
    return this.userPermissions.canDeleteForum;
  }

  // Charger les noms des auteurs pour tous les forums
  loadAuthorNames(): void {
    // Récupérer tous les IDs d'auteurs uniques
    const authorIds = [...new Set(this.forums.map(forum => forum.author))];

    // Pour chaque auteur, stocker son nom dans la map
    authorIds.forEach(authorId => {
      // Tous les IDs d'auteurs doivent être des IDs MongoDB valides
      // Les IDs MongoDB sont généralement des chaînes hexadécimales de 24 caractères
      if (authorId && /^[0-9a-fA-F]{24}$/.test(authorId)) {
        // C'est un ID MongoDB valide, récupérer le nom de l'utilisateur
        this.userService.getUserName(authorId).subscribe({
          next: (name) => {
            // Si le nom est "Utilisateur non trouvé", afficher un message plus explicite
            if (name === 'Utilisateur non trouvé') {
              console.warn(`L'utilisateur avec l'ID ${authorId} n'existe pas dans la base de données`);
              this.authorNames.set(authorId, 'Utilisateur non enregistré');
            } else {
              this.authorNames.set(authorId, name);
            }
          },
          error: (error) => {
            console.error(`Erreur lors de la récupération du nom de l'auteur ${authorId}:`, error);
            this.authorNames.set(authorId, 'Utilisateur non enregistré');
          }
        });
      } else {
        // Ce n'est pas un ID MongoDB valide, c'est probablement déjà un nom
        console.warn(`Format d'ID d'auteur invalide: ${authorId}. Utilisation comme nom direct.`);
        this.authorNames.set(authorId, authorId);
      }
    });
  }

  // Obtenir le nom de l'auteur à partir de son ID ou nom
  getAuthorName(authorId: string): string {
    // Si l'auteur n'est pas un ID MongoDB valide (24 caractères hexadécimaux), le retourner directement
    if (authorId && !/^[0-9a-fA-F]{24}$/.test(authorId)) {
      return authorId;
    }
    return this.authorNames.get(authorId) || 'Utilisateur non enregistré';
  }
}
