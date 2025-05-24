import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from '../../service/event.service';
import { EventUpdateDto } from '../../models/event.model';
import { CommunityService } from 'src/app/features/communities/services/community.service';
import { Community } from 'src/app/features/communities/models/communities.model';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {
  eventForm: FormGroup;
  eventId: string = '';
  isLoading = true;
  isSubmitting = false;
  errorMessage: string | null = null;
  communities: Community[] = [];
  loadingCommunities = false;
  isOnlineEvent = false;

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
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.eventId = id;
        this.loadEvent();
        this.loadCommunities();
      } else {
        this.errorMessage = 'ID de l\'événement invalide.';
        this.isLoading = false;
      }
    });
    
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

  loadEvent(): void {
    this.isLoading = true;
    
    this.eventService.getEventById(this.eventId)
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            const event = response.data;
            
            // Vérifier si l'utilisateur est l'organisateur
            if (!this.eventService.isEventOrganizer(event)) {
              this.errorMessage = 'Vous n\'êtes pas autorisé à modifier cet événement.';
              this.router.navigate(['/events/details', this.eventId]);
              return;
            }
            
            // Préparer les tags pour le formulaire
            const tagsString = event.tags ? event.tags.join(', ') : '';
            
            // Remplir le formulaire
            this.eventForm.patchValue({
              title: event.title,
              description: event.description,
              location: event.location,
              date: event.date,
              startTime: event.startTime,
              endTime: event.endTime,
              community: event.community,
              maxParticipants: event.maxParticipants,
              imageUrl: event.imageUrl,
              tags: tagsString,
              isOnline: event.isOnline,
              meetingLink: event.meetingLink
            });
            
            // Mettre à jour l'état isOnlineEvent
            this.isOnlineEvent = event.isOnline || false;
          } else {
            this.errorMessage = response.message || 'Erreur lors du chargement de l\'événement';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading event:', error);
          this.errorMessage = 'Erreur lors du chargement de l\'événement: ' + (error.message || 'Erreur inconnue');
          this.isLoading = false;
        }
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
    
    const eventData: EventUpdateDto = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      maxParticipants: formData.maxParticipants,
      imageUrl: formData.imageUrl,
      tags: tags,
      isOnline: formData.isOnline,
      meetingLink: formData.meetingLink
    };
    
    this.eventService.updateEvent(this.eventId, eventData)
      .subscribe({
        next: (response) => {
          if (response.success) {
            // Rediriger vers la page de détails de l'événement
            this.router.navigate(['/events/details', this.eventId]);
          } else {
            this.errorMessage = response.message || 'Erreur lors de la mise à jour de l\'événement';
            this.isSubmitting = false;
          }
        },
        error: (error) => {
          console.error('Error updating event:', error);
          this.errorMessage = 'Erreur lors de la mise à jour de l\'événement: ' + (error.message || 'Erreur inconnue');
          this.isSubmitting = false;
        }
      });
  }

  cancel(): void {
    this.router.navigate(['/events/details', this.eventId]);
  }

  // Helpers pour les validations de formulaire
  get title() { return this.eventForm.get('title'); }
  get description() { return this.eventForm.get('description'); }
  get location() { return this.eventForm.get('location'); }
  get date() { return this.eventForm.get('date'); }
  get community() { return this.eventForm.get('community'); }
  get meetingLink() { return this.eventForm.get('meetingLink'); }
}
