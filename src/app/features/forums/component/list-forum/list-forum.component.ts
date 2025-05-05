import { Component, OnInit } from '@angular/core';
import { ForumsService } from '../../service/forum.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forums-list',
  templateUrl: './list-forum.component.html',
  styleUrls: ['./list-forum.component.css']
})
export class ForumsListComponent implements OnInit {
  forums: any[] = [];

  constructor(
    private forumsService: ForumsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.forumsService.getAllForums().subscribe(data => {
      this.forums = data;
    });
  }

  onAddForum(): void {
    this.router.navigate(['/forums/add']);
  }

  onEditForum(forumId: string): void {
    // Rediriger vers la page d'édition avec l'ID du forum
    this.router.navigate(['/forums/edit', forumId]);
  }

  onDeleteForum(forumId: string): void {
    if (confirm('Es-tu sûr de vouloir supprimer ce forum ?')) {
      this.forumsService.deleteForum(forumId).subscribe(() => {
        // Met à jour la liste localement
        this.forums = this.forums.filter(f => f._id !== forumId);
        console.log('Forum supprimé avec succès.');
      });
    }
  }
  trackById(index: number, forum: any): string {
    return forum._id;
  }
  
}
