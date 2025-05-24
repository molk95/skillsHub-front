import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from '../../service/event.service';
import { EventCreateDto } from '../../models/event.model';
import { CommunityService } from 'src/app/features/communities/services/community.service';
import { Community } from 'src/app/features/communities/models/communities.model';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {
  eventForm: FormGroup;
  isLoading = false;
  isSubmitting = false;
  errorMessage: string | null = null;
  communities: Community[] = [];
  loadingCommunities = false;
  isOnlineEvent = false;
  preselectedCommunityId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private communityService: CommunityService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.eventForm = this.createForm();
  }

  ngOnInit(): void {
    // Vérifier s'il y a un ID de communauté dans les paramètres de requête
    this.route.queryParams.subscribe(params => {
      if (params['communityId']) {
        this.preselectedCommunityId = params['communityId'];
        this.eventForm.patchValue({ community: this.preselectedCommunityId });
      }
    });

    this.loadCommunities();
    
    // Observer les changements sur le champ isOnline
    this.eventForm.get('isOnline')?.valueChanges.subscribe(isOnline => {
      this.isOnlineEvent = isOnline;
      
      if (isOnline) {
        this.eventForm.get('meetingLink')?.setValidators([Validators.required]);
      } else {
        this.eventForm.get('meetingLink')?.clearValidators();
      }
      
      this.eventForm.get('meetingLink')?.updateValueAndValidity();
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      location: ['', Validators.required],
      date: ['', Validators.required],
      startTime: [''],
      endTime: [''],
      community: ['', Validators.required],
      maxParticipants: [null, [Validators.min(1), Validators.max(1000)]],
      imageUrl: [''],
      tags: [''],
      isOnline: [false],
      meetingLink: ['']
    });
  }

  loadCommunities(): void {
    this.loadingCommunities = true;
    
    this.communityService.getAllCommunities()
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.communities = response.data;
          }
          this.loadingCommunities = false;
        },
        error: (error) => {
          console.error('Error loading communities:', error);
          this.errorMessage = 'Erreur lors du chargement des communautés';
          this.loadingCommunities = false;
        }
      });
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.eventForm.controls).forEach(key => {
        const control = this.eventForm.get(key);
        control?.markAsTouched();
      });
      return;
    }
    
    this.isSubmitting = true;
    this.errorMessage = null;
    
    // Préparer les données de l'événement
    const formData = this.eventForm.value;
    
    // Convertir les tags en tableau s'ils sont fournis
    let tags: string[] = [];
    if (formData.tags) {
      tags = formData.tags.split(',').map((tag: string) => tag.trim());
    }
    
    const eventData: EventCreateDto = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      community: formData.community,
      maxParticipants: formData.maxParticipants,
      imageUrl: formData.imageUrl,
      tags: tags,
      isOnline: formData.isOnline,
      meetingLink: formData.meetingLink
    };
    
    this.eventService.createEvent(eventData)
      .subscribe({
        next: (response) => {
          if (response.success) {
            // Rediriger vers la page de détails de l'événement
            this.router.navigate(['/events/details', response.data.id]);
          } else {
            this.errorMessage = response.message || 'Erreur lors de la création de l\'événement';
            this.isSubmitting = false;
          }
        },
        error: (error) => {
          console.error('Error creating event:', error);
          this.errorMessage = 'Erreur lors de la création de l\'événement: ' + (error.message || 'Erreur inconnue');
          this.isSubmitting = false;
        }
      });
  }

  cancel(): void {
    // Si on vient d'une communauté, retourner à cette communauté
    if (this.preselectedCommunityId) {
      this.router.navigate(['/communities/details', this.preselectedCommunityId]);
    } else {
      // Sinon, retourner à la liste des événements
      this.router.navigate(['/events']);
    }
  }

  // Helpers pour les validations de formulaire
  get title() { return this.eventForm.get('title'); }
  get description() { return this.eventForm.get('description'); }
  get location() { return this.eventForm.get('location'); }
  get date() { return this.eventForm.get('date'); }
  get community() { return this.eventForm.get('community'); }
  get meetingLink() { return this.eventForm.get('meetingLink'); }
}
