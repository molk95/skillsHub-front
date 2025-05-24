import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ForumService } from '../../service/forum.service';
import { Forum } from '../../models/forums.model';
import { DatePipe } from '@angular/common';
import { CommentService } from '../../service/comment.service';
import { Comment } from '../../models/comment.model';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-forum-details',
  templateUrl: './forum-details.component.html',
  styleUrls: ['./forum-details.component.css'],
  providers: [DatePipe],
})
export class ForumDetailsComponent implements OnInit {
  forum: Forum | undefined;
  forumId: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  newComment: string = '';
  communityId: string = '';
  isAuthor: boolean = false;
  showDeleteConfirmation: boolean = false;
  currentUserId: string = '';
  commentObjects: Comment[] = [];
  authorName: string = 'Utilisateur';

  constructor(
    private forumService: ForumService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private commentService: CommentService,
    private userService: UserService
  ) {
    // Récupérer l'ID de l'utilisateur connecté (à adapter selon votre système d'authentification)
    this.currentUserId = localStorage.getItem('userId') || '64f8b8e55a1c9b1c5e8b4567';
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.forumId = id;
        this.loadForum();
      } else {
        this.errorMessage = 'ID du forum invalide.';
      }
    });
  }

  loadForum(): void {
    this.isLoading = true;
    this.forumService.getForumById(this.forumId).then(
      (forum: Forum | undefined) => {
        if (forum) {
          this.forum = forum;
          this.communityId = forum.community;

          // Vérifier si l'utilisateur est l'auteur du forum
          this.isAuthor = forum.author === this.currentUserId;

          // Récupérer le nom de l'auteur du forum
          this.userService.getUserName(forum.author).subscribe({
            next: (name) => {
              if (name === 'Utilisateur non trouvé') {
                console.warn(`L'utilisateur avec l'ID ${forum.author} n'existe pas dans la base de données`);
                this.authorName = 'Utilisateur non enregistré';
              } else {
                this.authorName = name;
                console.log('Nom de l\'auteur récupéré:', name);
              }
            },
            error: (error) => {
              console.error('Erreur lors de la récupération du nom de l\'auteur:', error);
              this.authorName = 'Utilisateur non enregistré';
            }
          });

          // Incrémenter le compteur de vues
          if (forum.viewCount !== undefined) {
            forum.viewCount++;
          } else {
            forum.viewCount = 1;
          }

          // Mettre à jour le forum avec le nouveau compteur de vues
          this.updateViewCount();

          // Charger les commentaires si le forum en a
          if (forum.comments && forum.comments.length > 0) {
            this.loadComments(forum.comments as string[]);
          }
        } else {
          this.errorMessage = "Forum non trouvé.";
        }
        this.isLoading = false;
      },
      (err) => {
        console.error('Erreur lors du chargement du forum:', err);
        this.errorMessage = "Impossible de charger les données du forum.";
        this.isLoading = false;
      }
    );
  }

  updateViewCount(): void {
    if (!this.forum || !this.forum.id) return;

    // Créer une copie du forum pour la mise à jour
    const updatedForum: Forum = { ...this.forum };

    this.forumService.updateForum(this.forum.id, updatedForum)
      .then(() => {
        console.log('Compteur de vues mis à jour');
      })
      .catch(err => {
        console.error('Erreur lors de la mise à jour du compteur de vues:', err);
      });
  }

  loadComments(commentIds: string[]): void {
    // Créer un tableau d'observables pour chaque commentaire
    const commentRequests = commentIds.map(commentId =>
      this.commentService.getCommentsByForumId(this.forumId).pipe(
        map(response => {
          if (response.success && response.data) {
            // Trouver le commentaire correspondant à l'ID
            const comment = response.data.find(c => c.id === commentId);
            return comment || null;
          }
          return null;
        }),
        catchError(error => {
          console.error(`Erreur lors du chargement du commentaire ${commentId}:`, error);
          return of(null);
        })
      )
    );

    // Exécuter toutes les requêtes en parallèle
    forkJoin(commentRequests).subscribe(comments => {
      // Filtrer les commentaires null (en cas d'erreur)
      this.commentObjects = comments.filter(comment => comment !== null) as Comment[];
      console.log('Commentaires chargés:', this.commentObjects);
    });
  }

  addComment(): void {
    if (!this.forum || !this.newComment.trim()) return;

    // Si comments n'existe pas, l'initialiser
    if (!this.forum.comments) {
      this.forum.comments = [];
    }

    // Create a new comment through the comment service and store its ID
    this.commentService.addComment({
      content: this.newComment,
      author: this.currentUserId,
      forum: this.forumId,
      created_at: new Date().toISOString()
    }).subscribe((response) => {
      const newComment = response.data;
      // Push the comment ID to the forum's comments array
      if (newComment && newComment.id) {
        if (this.forum?.comments) {
          this.forum.comments.push(newComment.id as unknown as string & Comment);
        } else {
          this.forum!.comments = [newComment.id];
        }
      }
    });

    // Réinitialiser le champ de commentaire
    this.newComment = '';

    // Mettre à jour le forum avec le nouveau commentaire
    if (this.forum.id) {
      this.forumService.updateForum(this.forum.id, this.forum)
        .then(() => {
          console.log('Commentaire ajouté et sauvegardé');
          this.successMessage = 'Votre commentaire a été ajouté avec succès';
          setTimeout(() => this.successMessage = '', 3000);
        })
        .catch(err => {
          console.error('Erreur lors de la sauvegarde du commentaire:', err);
          this.errorMessage = 'Erreur lors de la sauvegarde du commentaire';
        });
    }
  }

  likeForum(): void {
    if (!this.forum || !this.forum.id) return;

    // Incrémenter le compteur de likes
    if (this.forum.likeCount !== undefined) {
      this.forum.likeCount++;
    } else {
      this.forum.likeCount = 1;
    }

    // Mettre à jour le forum avec le nouveau compteur de likes
    this.forumService.updateForum(this.forum.id, this.forum)
      .then(() => {
        console.log('Like ajouté');
        this.successMessage = 'Vous avez aimé ce forum';
        setTimeout(() => this.successMessage = '', 3000);
      })
      .catch(err => {
        console.error('Erreur lors de l\'ajout du like:', err);
        this.errorMessage = 'Erreur lors de l\'ajout du like';

        // Annuler l'incrémentation en cas d'erreur
        if (this.forum && this.forum.likeCount !== undefined && this.forum.likeCount > 0) {
          this.forum.likeCount--;
        }
      });
  }

  editForum(): void {
    if (!this.forum || !this.forum.id) return;
    this.router.navigate(['/forums/edit', this.forum.id]);
  }

  showDeleteModal(): void {
    this.showDeleteConfirmation = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
  }

  deleteForum(): void {
    if (!this.forum || !this.forum.id) return;

    this.forumService.deleteForum(this.forum.id)
      .then(() => {
        console.log('Forum supprimé');
        this.router.navigate(['/communities/details', this.communityId]);
      })
      .catch(err => {
        console.error('Erreur lors de la suppression du forum:', err);
        this.errorMessage = 'Erreur lors de la suppression du forum';
        this.showDeleteConfirmation = false;
      });
  }

  goBackToCommunity(): void {
    if (this.communityId) {
      this.router.navigate(['/communities/details', this.communityId]);
    } else {
      this.router.navigate(['/forums']);
    }
  }

  formatDate(date: string | undefined): string {
    if (!date) return '';
    return this.datePipe.transform(date, 'dd MMMM yyyy à HH:mm') || '';
  }
}





















