import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ForumService } from '../../service/forum.service';
import { Forum } from '../../models/forums.model';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-edit-forum',
  templateUrl: './edit-forum.component.html',
  styleUrls: ['./edit-forum.component.css']
})
export class EditForumComponent implements OnInit {
  forum: Forum = {
    id: '',
    title: '',
    author: '',
    content: '',
    comments: [],
    created_at: '',
    community: '',
    ratings: []
  };

  forumId: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  authorName: string = 'Utilisateur';

  constructor(
    private forumService: ForumService,
    private route: ActivatedRoute,
    public router: Router,
    private userService: UserService
  ) {}

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

          // Récupérer le nom de l'auteur
          this.userService.getUserName(forum.author).subscribe({
            next: (name) => {
              this.authorName = name;
              console.log('Nom de l\'auteur récupéré:', name);
            },
            error: (error) => {
              console.error('Erreur lors de la récupération du nom de l\'auteur:', error);
            }
          });
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

  updateForum(): void {
    this.isLoading = true;
    this.forumService.updateForum(this.forumId, this.forum).then(
      (response: Forum | undefined) => {
        console.log('Forum mis à jour avec succès', response);
        this.router.navigate(['/forums']); // Minuscules
      },
      (err) => {
        console.error('Erreur lors de la mise à jour du forum:', err);
        this.errorMessage = "La mise à jour a échoué.";
        this.isLoading = false;
      }
    );
  }
}

