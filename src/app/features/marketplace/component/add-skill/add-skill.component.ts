import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarketplaceService } from '../../services/marketplace.service';
import { Router } from '@angular/router';
import { Skill } from '../../models/skill.model';
import { ReactiveFormsModule } from '@angular/forms';
import { Category } from '../../models/category.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-skill',
  templateUrl: './add-skill.component.html',
  styleUrls: ['./add-skill.component.css']
})


export class AddSkillComponent {
  skillForm!: FormGroup;
  categories: Category[] = [];
  constructor(private fb: FormBuilder,private skillService: MarketplaceService,private router: Router) {}
    ngOnInit(){
    this.skillForm = this.fb.group({
    
      name: ['', [Validators.required, Validators.minLength(3)]],
     description: ['', [Validators.required, Validators.minLength(10)]],
     category: ['', Validators.required],
     userId: ['', Validators.required]
      });
      this.skillService.getAllCategory().subscribe(
        (data) => {
          this.categories = data;  // Assignation des données récupérées à la variable categories
        },
        (error) => {
          console.error('Erreur lors de la récupération des catégories', error);
        }
      );
    }
   
  
        
  addSkill() {
    if (this.skillForm.valid) {
  
      const skill: Skill= this.skillForm.value;
      
      this.skillService.addSkill(skill).subscribe({
        next: () => {
          alert('Skill ajouté avec succès!');
          this.router.navigate(['/MarketplaceList']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erreur lors de l\'ajout du skill :', {
            status: err.status,
            message: err.message,
            error: err.error
          });
        }
      });
    } else {
      alert('Formulaire invalide. Veuillez vérifier les champs.');
    }
  }
}