import { Component } from '@angular/core';

@Component({
  selector: 'app-simple-forums',
  template: `
    <div class="container mt-4">
      <h2 class="text-center mb-4">🎯 Forums - Page de Test Simple</h2>
      
      <div class="alert alert-success">
        <h4>✅ La page Forums fonctionne !</h4>
        <p>Félicitations ! Vous avez réussi à accéder à la page forums.</p>
      </div>

      <div class="row">
        <div class="col-md-6 mb-3" *ngFor="let forum of forums">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">{{ forum.title }}</h5>
              <p class="card-text">{{ forum.content }}</p>
              <small class="text-muted">
                Par: {{ forum.author }} | 
                Vues: {{ forum.views }} | 
                Likes: {{ forum.likes }}
              </small>
              <div class="mt-2">
                <button class="btn btn-sm btn-primary me-2" (click)="likePost(forum.id)">
                  ❤️ J'aime ({{ forum.likes }})
                </button>
                <button class="btn btn-sm btn-warning me-2">
                  ✏️ Modifier
                </button>
                <button class="btn btn-sm btn-danger">
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-4">
        <button class="btn btn-success btn-lg">
          ➕ Ajouter un Forum
        </button>
      </div>
    </div>
  `,
  styles: [`
    .card {
      transition: transform 0.2s;
    }
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
  `]
})
export class SimpleForumsComponent {
  forums = [
    {
      id: 1,
      title: '🚀 Forum JavaScript Avancé',
      content: 'Discutons des dernières fonctionnalités de JavaScript et des meilleures pratiques.',
      author: 'Amir Test',
      views: 120,
      likes: 45
    },
    {
      id: 2,
      title: '🎨 Design UI/UX Moderne',
      content: 'Partageons nos idées sur les tendances actuelles en design d\'interface.',
      author: 'Yassine Benaoun',
      views: 85,
      likes: 32
    },
    {
      id: 3,
      title: '🤖 Intelligence Artificielle',
      content: 'Explorons ensemble le monde fascinant de l\'IA et du machine learning.',
      author: 'Chayma Samaali',
      views: 65,
      likes: 18
    }
  ];

  likePost(forumId: number) {
    const forum = this.forums.find(f => f.id === forumId);
    if (forum) {
      forum.likes++;
      console.log(`Forum ${forumId} liké ! Nouveau total: ${forum.likes}`);
    }
  }
}
