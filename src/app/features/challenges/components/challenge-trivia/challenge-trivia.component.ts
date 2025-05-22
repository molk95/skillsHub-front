import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChallengeService } from '../../service/challenge.service';

@Component({
  selector: 'app-challenge-trivia',
  templateUrl: './challenge-trivia.component.html',
  styleUrls: ['./challenge-trivia.component.css']
})
export class ChallengeTriviaComponent implements OnInit {
  triviaForm!: FormGroup;
  triviaQuestions: any[] = [];
  categories: any[] = [];
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private challengeService: ChallengeService
  ) {}

  ngOnInit(): void {
    this.triviaForm = this.fb.group({
      amount: [5, [Validators.required, Validators.min(1), Validators.max(50)]],
      category: [null, Validators.required],
      difficulty: ['medium', Validators.required],
      type: ['multiple', Validators.required],
    });

    this.challengeService.getTriviaCategories().subscribe({
      next: (response) => {
        this.categories = response.trivia_categories || [];
        console.log('Catégories trivia récupérées :', this.categories);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des catégories :', error.message);
        this.errorMessage = 'Impossible de charger les catégories.';
      }
    });
  }

  fetchTriviaQuestions(): void {
    if (this.triviaForm.valid) {
      const formData = this.triviaForm.value;
      console.log('Données envoyées au backend :', formData);

      this.challengeService.getTriviaQuestions(formData).subscribe({
        next: (questions) => {
          console.log('Questions reçues du backend :', questions);

          const results = Array.isArray(questions) ? questions : questions.results || [];

          this.triviaQuestions = results.map((q: any) => ({
            ...q,
            shuffledAnswers: this.shuffleAnswers(q),
          }));

          this.errorMessage = this.triviaQuestions.length ? null : 'Aucune question trouvée.';
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des questions :', error.message);
          this.errorMessage = 'Impossible de récupérer les questions.';
        }
      });
    } else {
      this.errorMessage = 'Le formulaire est invalide. Veuillez corriger les erreurs.';
    }
  }

  // 🔀 Méthode pour mélanger les réponses
  shuffleAnswers(question: any): string[] {
    const answers = [...question.incorrect_answers, question.correct_answer];
    return answers.sort(() => Math.random() - 0.5);
  }
}
