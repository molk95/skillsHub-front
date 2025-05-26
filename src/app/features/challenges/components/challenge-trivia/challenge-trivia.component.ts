import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChallengeService } from '../../service/challenge.service';
import { BadgeService } from 'src/app/features/badges/service/badge.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
  user: any;
  currentUser: any;
  role: any;
  score: number = 0;
  currentChallengeId!: string;
  challenge: any;

  constructor(
    private fb: FormBuilder,
    private challengeService: ChallengeService,
    private badgeService: BadgeService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.triviaForm = this.fb.group({
      amount: [5],
      category: [''],
      difficulty: ['easy'],
      type: ['multiple']
    });

    this.loadCategories();

    this.user = localStorage.getItem('user');
    if (!this.user) {
      this.errorMessage = 'Utilisateur non connecté.';
      return;
    }

    this.currentUser = JSON.parse(this.user);
    this.role = this.currentUser.role;

    // ✅ Étape 1 : Récupération de l'ID depuis les paramètres ou localStorage
    const challengeJson = localStorage.getItem('selectedChallenge');
    if (!challengeJson) {
      this.errorMessage = "Aucun challenge sélectionné.";
      return;
    }

    const challenge = JSON.parse(challengeJson);
    const challengeIdFromRoute = challenge._id;

    // ✅ Appel backend pour avoir les données du challenge
    this.http.get(`http://127.0.0.1:3000/api/challenges/${challengeIdFromRoute}`).subscribe((challenge: any) => {
      this.challenge = challenge;
      this.currentChallengeId = challenge._id;
      this.triviaQuestions = challenge.questions.map((q: any) => ({
        ...q,
        shuffledAnswers: this.shuffleAnswers(q),
        selectedAnswer: null
      }));
    });

    this.loadTriviaForm(challenge.triviaSettings);
  }

  loadCategories(): void {
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

  loadTriviaForm(triviaSettings?: any): void {
    this.triviaForm = this.fb.group({
      amount: [triviaSettings?.amount || 5, [Validators.required, Validators.min(1), Validators.max(50)]],
      category: [triviaSettings?.category || null, Validators.required],
      difficulty: [triviaSettings?.difficulty || 'medium', Validators.required],
      type: [triviaSettings?.type || 'multiple', Validators.required],
    });
  }

  fetchTriviaQuestions(): void {
    if (!this.triviaForm.valid) {
      this.errorMessage = 'Le formulaire est invalide.';
      return;
    }

    const formData = this.triviaForm.value;
    console.log('Formulaire envoyé :', formData);

    if (!formData.amount || !formData.category || !formData.difficulty || !formData.type) {
      this.errorMessage = 'Veuillez remplir tous les champs du formulaire.';
      return;
    }

    this.challengeService.getTriviaQuestions(formData).subscribe({
      next: (questions) => {
        const results = Array.isArray(questions) ? questions : questions.results || [];
        this.triviaQuestions = results.map((q: any) => ({
          ...q,
          shuffledAnswers: this.shuffleAnswers(q),
          selectedAnswer: null
        }));
        this.errorMessage = this.triviaQuestions.length ? null : 'Aucune question trouvée.';
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des questions :', error.message);
        this.errorMessage = 'Erreur dans la récupération des questions.';
      }
    });
  }

  shuffleAnswers(question: any): string[] {
    const answers = [...question.incorrect_answers, question.correct_answer];
    return answers.sort(() => Math.random() - 0.5);
  }

  submitQuiz(): void {
    let correctAnswers = 0;
    this.triviaQuestions.forEach(q => {
      if (q.selectedAnswer === q.correct_answer) {
        correctAnswers++;
      }
    });

    this.score = correctAnswers;

    // ✅ Envoi du score + currentChallengeId correct
    this.challengeService.saveUserScore(this.currentUser.id, this.currentChallengeId, this.score).subscribe({
      next: () => {
        this.badgeService.assignBadge(this.currentUser.id, this.score).subscribe({
          next: () => {
            console.log('Badge attribué avec succès');
          },
          error: (err) => {
            console.error('Erreur lors de l\'attribution du badge :', err.message);
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors de l\'enregistrement du score :', err.message);
      }
    });
  }

  submitScore(): void {
    const scoreData = {
      userId: this.currentUser.id,
      challengeId: this.currentChallengeId,
      score: this.score
    };

    console.log('Score envoyé au backend :', scoreData);

    this.challengeService.saveUserScore(this.currentUser.id, this.currentChallengeId, this.score).subscribe({
      next: (response) => {
        console.log('Score enregistré avec succès', response);
      },
      error: (error) => {
        console.error('Erreur lors de l\'enregistrement du score :', error);
      }
    });
  }
}
