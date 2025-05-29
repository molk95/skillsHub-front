import { Component, OnInit } from '@angular/core';
import { ForumService } from '../../service/forum.service';
import { Forum } from '../../models/forums.model';
import { Router } from '@angular/router';
import { CommunityService } from '../../../communities/services/community.service';
import { Community } from '../../../communities/models/communities.model';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-add-forum',
  templateUrl: './add-forum.component.html',
  styleUrls: ['./add-forum.component.css']
})
export class AddForumComponent implements OnInit {
  forum: Forum = {
    id: '',
    title: '',
    author: '',
    content: '',
    comments: [],
    created_at: new Date().toISOString(),
    community: '',
    ratings: []
  };

  communities: Community[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private forumService: ForumService,
    private communityService: CommunityService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadCommunities();
    // Ne pas définir l'auteur par défaut, laisser le champ vide
    this.forum.author = '';
  }

  loadCommunities(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.communityService.getAllCommunities()
      .subscribe({
        next: (response) => {
          if (response && response.data && Array.isArray(response.data)) {
            this.communities = response.data;
          } else if (Array.isArray(response)) {
            this.communities = response;
          } else {
            this.errorMessage = 'Format de réponse inattendu lors du chargement des communautés';
            this.communities = [];
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des communautés:', error);
          this.errorMessage = 'Impossible de charger les communautés. Veuillez réessayer plus tard.';
          this.isLoading = false;
        }
      });
  }

  addForum(): void {
    if (!this.forum.title || !this.forum.content || !this.forum.community) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Create a forum object with only the required fields
    const forumToSend: Forum = {
      title: this.forum.title,
      author: this.forum.author, // Auteur saisi par l'utilisateur
      content: this.forum.content,
      community: this.forum.community, // ID de la communauté sélectionnée
      comments: [],
      created_at: new Date().toISOString(),
      ratings: []
    };

    console.log('Envoi des données du forum:', forumToSend);

    this.forumService.createForum(forumToSend)
      .then((response) => {
        console.log('Forum ajouté avec succès:', response);
        this.successMessage = 'Forum ajouté avec succès!';
        setTimeout(() => {
          this.router.navigate(['/forums']);
        }, 1500);
      })
      .catch((error) => {
        console.error('Erreur détaillée:', error);
        this.errorMessage = `Erreur lors de l'ajout du forum: ${error.message || 'Problème de connexion au serveur'}`;
      });
  }
}
