import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SalonsService, IDocument, ICommentaire } from '../../services/salons.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-salon-documents',
  templateUrl: './salon-documents.component.html',
  styleUrls: ['./salon-documents.component.css']
})

export class SalonDocumentsComponent implements OnInit {
  salonId!: string;
  salonName: string = '';
  documents: IDocument[] = [];
  loading = false;
  error = '';
  selectedDocumentUrl: SafeResourceUrl | null = null;
 selectedDocumentType: 'pdf' | 'video' | 'image' | null = null;
  // Pour les commentaires
  commentaires: { [documentId: string]: ICommentaire[] } = {};
  nouveauCommentaire: { [documentId: string]: string } = {};
  viewMode: 'list' | 'card' = 'list'; // Valeur par défaut
  notification: { message: string, type: 'success'|'info'|'error' } | null = null;
  searchTerm: string = '';
  searchResults: any[] = [];
  fileToUpload: File | null = null;
  constructor(
    private route: ActivatedRoute,
    private salonsService: SalonsService,
     private sanitizer: DomSanitizer
  ) {}

  // Make sure filteredDocuments is defined
  filteredDocuments: IDocument[] = [];

ngOnInit(): void {
  this.route.params.subscribe(params => {
    this.salonId = params['id'];
    if (this.salonId) {
      this.loadDocuments();
      this.loadSalonName(); // Ajoute ceci !
    } else {
      this.error = 'ID du salon non trouvé dans l\'URL';
    }
  });
}

/**
 * Récupère le nom du salon à partir de son ID (pour le bouton sessions)
 */
loadSalonName() {
  this.salonsService.getSalonById(this.salonId).subscribe({
    next: salon => {
      this.salonName = salon.nom; // Assure-toi que "nom" existe côté backend
    },
    error: err => {
      this.salonName = '';
      console.error('Erreur chargement nom du salon:', err);
    }
  });
}

  loadDocuments() {
    this.loading = true;
    this.error = '';
    console.log('Chargement des documents pour le salon ID:', this.salonId);
    
    this.salonsService.getDocumentsBySalon(this.salonId).subscribe({
      next: docs => {
        console.log('Documents récupérés:', docs);
        this.documents = docs;
        this.filteredDocuments = docs; // Initialiser filteredDocuments
        this.loading = false;
        
        if (docs.length === 0) {
          this.error = 'Aucun document disponible pour ce salon.';
        }
      },
      error: err => {
        console.error('Erreur lors du chargement des documents:', err);
        this.error = "Erreur lors du chargement des documents";
        this.loading = false;
      }
    });
  }

  deleteDocument(docId: string) {
    if (!confirm("Supprimer ce document ?")) return;
    this.salonsService.deleteDocument(docId).subscribe({
      next: () => this.loadDocuments(),
      error: () => alert("Erreur lors de la suppression")
    });
  }

showPdf(pdfUrl: string) {
  const url = 'http://localhost:3000' + pdfUrl;
  this.selectedDocumentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
}

closePdf() {
  this.selectedDocumentUrl = null;
}
get documentsToDisplay(): any[] {
    return this.searchTerm.trim()
      ? this.searchResults
      : this.documents;
  }

  clearSearch() {
    this.searchTerm = '';
    this.searchResults = [];
  }

deletePdf(doc: IDocument) {
  if (!confirm('Supprimer ce document ?')) return;
  this.salonsService.deleteDocument(doc._id!).subscribe({
    next: () => this.loadDocuments(),
    error: () => alert('Erreur lors de la suppression du document')
  });
}

 // Chargement des commentaires pour un document
  loadCommentaires(docId: string) {
    this.salonsService.getCommentaires(docId).subscribe({
      next: cmts => this.commentaires[docId] = cmts,
      error: () => this.commentaires[docId] = []
    });
  }

  showNotification(message: string, type: 'success'|'info'|'error' = 'success') {
  this.notification = { message, type };
  setTimeout(() => this.notification = null, 5000); // disparait après 3s
}

addCommentaire(docId: string, auteur: string) {
  const texte = this.nouveauCommentaire[docId]?.trim();
  if (!texte) return;
  this.salonsService.addCommentaire(docId, { auteur, texte }).subscribe({
    next: () => {
      // Après ajout réussi, rafraîchir la liste des commentaires
      this.nouveauCommentaire[docId] = '';
      this.loadCommentaires(docId);
    },
    complete: () => {
      this.showNotification('Commentaire envoyé !', 'success');
    },
    error: () => {
      alert("Erreur lors de l'envoi du commentaire.");
    }
  });
}

supprimerCommentaire(docId: string, commentaireId: string) {
  if (!docId || !commentaireId) return;
  this.salonsService.deleteCommentaire(docId, commentaireId).subscribe({
    next: () => {
      if (this.commentaires[docId]) {
        this.commentaires[docId] = this.commentaires[docId].filter(c => c._id !== commentaireId);
      }
    },
    error: (err) => {
      // Pour debug : regarde la console si souci serveur
      console.error('Erreur suppression commentaire:', err);
    }
  });
}

uploadFile(event: any) {
  const file = event.target.files[0];
  if (!file || !this.salonId) {
    this.showNotification('Aucun fichier sélectionné ou salon non identifié', 'error');
    return;
  }
  
  // Vérification du type de fichier
  if (!file.type.startsWith('application/pdf') && 
      !file.type.startsWith('video/') && 
      !file.type.startsWith('image/')) {
    this.showNotification('Type de fichier non supporté. Utilisez PDF, vidéo ou image.', 'error');
    return;
  }
  
  // Augmentation de la limite à 50MB
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB en octets
  if (file.size > MAX_FILE_SIZE) {
    this.showNotification(`Fichier trop volumineux (max ${MAX_FILE_SIZE / (1024 * 1024)}MB)`, 'error');
    return;
  }
  
  this.loading = true;
  this.error = '';
  
  this.salonsService.uploadSalonFile(file, this.salonId).subscribe({
    next: () => {
      this.showNotification('Document uploadé avec succès !', 'success');
      this.loadDocuments();
      this.loading = false;
    },
    error: (err) => {
      console.error('Erreur upload:', err);
      this.showNotification(err.message || 'Erreur lors de l\'upload', 'error');
      this.loading = false;
    }
  });
}
// Ajoute une méthode utilitaire pour savoir si un document est une vidéo :
isVideo(doc: IDocument): boolean {
  return doc.mimetype?.startsWith('video/');
}
// Ajoute une méthode utilitaire pour savoir si un document est un PDF :
isPdf(doc: IDocument): boolean {
  return doc.mimetype === 'application/pdf' || doc.url.toLowerCase().endsWith('.pdf');
}
// Ajoute une méthode utilitaire pour savoir si un document est une image :
isImage(doc: IDocument): boolean {
  return doc.mimetype?.startsWith('image/') || 
         ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].some(ext => 
           doc.url.toLowerCase().endsWith(`.${ext}`));
}
showDocument(doc: IDocument) {
  if (!doc || !doc.url) {
    this.showNotification('URL du document invalide', 'error');
    return;
  }
  
  const url = doc.url.startsWith('http') ? doc.url : 'http://localhost:3000' + doc.url;
  
  if (this.isPdf(doc)) {
    this.selectedDocumentType = 'pdf';
    this.selectedDocumentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  } else if (this.isVideo(doc)) {
    this.selectedDocumentType = 'video';
    this.selectedDocumentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  } else if (this.isImage(doc)) {
    this.selectedDocumentType = 'image';
    this.selectedDocumentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  } else {
    this.showNotification('Type de document non pris en charge', 'error');
  }
}
closeDocument() {
  this.selectedDocumentUrl = null;
  this.selectedDocumentType = null;
}
// Ajoute cette méthode
noterPdf(doc: IDocument) {
  // Vérifier si le document a déjà 5 étoiles
  if (doc.etoiles && doc.etoiles >= 5) {
    // Ne rien faire si déjà à 5 étoiles
    return;
  }
  
  this.salonsService.addEtoile(doc._id!).subscribe({
    next: (res) => {
      // Limiter à 5 étoiles maximum
      doc.etoiles = Math.min(res.etoiles, 5);
    },
    error: () => {
      this.showNotification("Erreur lors de la notation.", "error");
    }
  });
}

// Ajoute cette méthode dans ta classe SalonDocumentsComponent

reactToComment(docId: string, commentId: string, reaction: 'like'|'success' | 'love') {
  // Trouver le commentaire actuel
  const comment = this.commentaires[docId]?.find(c => c._id === commentId);
  
  // Si l'utilisateur a déjà cette réaction, on la supprime (toggle)
  if (comment?.userReactions?.[reaction]) {
    // Annuler la réaction existante
    this.salonsService.reactToComment(docId, commentId, reaction, 'current-user').subscribe({
      next: res => {
        if (comment) comment.reactions = res.reactions;
        if (comment) comment.userReactions = res.userReactions;
      },
      error: () => this.showNotification("Erreur lors de la réaction", "error")
    });
    return;
  }
  
  // Si l'utilisateur a déjà une autre réaction, on l'annule d'abord
  const hasOtherReaction = comment?.userReactions && 
    (comment.userReactions.like || 
     comment.userReactions.success || 
     comment.userReactions.love);
  
  if (hasOtherReaction && comment?.userReactions) {
    // Annuler toutes les réactions existantes
    const existingReaction = 
      comment.userReactions.like ? 'like' : 
      comment.userReactions.success ? 'success' : 'love';
    
    this.salonsService.reactToComment(docId, commentId, existingReaction, 'current-user').subscribe({
      next: () => {
        // Puis ajouter la nouvelle réaction
        this.salonsService.reactToComment(docId, commentId, reaction, 'current-user').subscribe({
          next: res => {
            if (comment) comment.reactions = res.reactions;
            if (comment) comment.userReactions = res.userReactions;
          },
          error: () => this.showNotification("Erreur lors de la réaction", "error")
        });
      },
      error: () => this.showNotification("Erreur lors de la réaction", "error")
    });
  } else {
    // Sinon, ajouter simplement la nouvelle réaction
    this.salonsService.reactToComment(docId, commentId, reaction, 'current-user').subscribe({
      next: res => {
        if (comment) comment.reactions = res.reactions;
        if (comment) comment.userReactions = res.userReactions;
      },
      error: () => this.showNotification("Erreur lors de la réaction", "error")
    });
  }
}
onSearchDocuments() {
  if (!this.searchTerm.trim()) {
    this.searchResults = [];
    return;
  }
  this.salonsService
    .searchDocumentsByNameInSalon(this.salonId, this.searchTerm.trim())
    .subscribe({
      next: docs => this.searchResults = docs,
      error: () => this.showNotification("Erreur lors de la recherche", "error"),
    });
}

previewFile(event: any) {
  const file = event.target.files[0];
  if (!file) return;
  
  // Créer un URL pour la prévisualisation
  const fileUrl = URL.createObjectURL(file);
  
  // Vérifier le type de fichier
  if (file.type.startsWith('video/')) {
    this.selectedDocumentType = 'video';
  } else if (file.type === 'application/pdf') {
    this.selectedDocumentType = 'pdf';
  } else if (file.type.startsWith('image/')) {
    this.selectedDocumentType = 'image';
  } else {
    // Type non supporté
    this.showNotification('Type de fichier non supporté', 'error');
    return;
  }
  
  // Vérification de la taille du fichier (max 50MB)
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB en octets
  if (file.size > MAX_FILE_SIZE) {
    this.showNotification(`Fichier trop volumineux (max ${MAX_FILE_SIZE / (1024 * 1024)}MB)`, 'error');
    return;
  }
  
  this.selectedDocumentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
  this.fileToUpload = file;
}

uploadPreviewedFile() {
  if (!this.fileToUpload || !this.salonId) {
    this.showNotification('Aucun fichier sélectionné ou salon non identifié', 'error');
    return;
  }
  
  this.loading = true;
  this.error = '';
  
  this.salonsService.uploadSalonFile(this.fileToUpload, this.salonId).subscribe({
    next: () => {
      this.showNotification('Document uploadé avec succès !', 'success');
      this.loadDocuments();
      this.closeDocument();
      this.fileToUpload = null;
      this.loading = false;
    },
    error: (err) => {
      console.error('Erreur upload:', err);
      this.showNotification(err.message || 'Erreur lors de l\'upload', 'error');
      this.loading = false;
    }
  });
}

// Ajouter ces méthodes au composant SalonDocumentsComponent

/**
 * Détermine le type de document à afficher
 */
getDocumentType(mimetype: string): string {
  if (!mimetype) return 'Document';
  
  if (mimetype.startsWith('image/')) {
    return 'Image';
  } else if (mimetype.startsWith('video/')) {
    return 'Vidéo';
  } else if (mimetype === 'application/pdf') {
    return 'PDF';
  } else {
    return 'Document';
  }
}

/**
 * Retourne la classe d'icône FontAwesome appropriée selon le type de document
 */
getDocumentIcon(mimetype: string): string {
  if (!mimetype) return 'fas fa-file';
  
  if (mimetype.startsWith('image/')) {
    return 'fas fa-file-image text-primary';
  } else if (mimetype.startsWith('video/')) {
    return 'fas fa-file-video text-danger';
  } else if (mimetype === 'application/pdf') {
    return 'fas fa-file-pdf text-danger';
  } else if (mimetype.startsWith('text/')) {
    return 'fas fa-file-alt text-info';
  } else if (mimetype.includes('word') || mimetype.includes('document')) {
    return 'fas fa-file-word text-primary';
  } else if (mimetype.includes('excel') || mimetype.includes('sheet')) {
    return 'fas fa-file-excel text-success';
  } else if (mimetype.includes('powerpoint') || mimetype.includes('presentation')) {
    return 'fas fa-file-powerpoint text-warning';
  } else {
    return 'fas fa-file text-secondary';
  }
}

/**
 * Formate la taille du fichier en unités lisibles (KB, MB, etc.)
 */
formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Filtre les documents selon le terme de recherche
 */
filterDocuments(): void {
  if (!this.searchTerm || !this.searchTerm.trim()) {
    this.filteredDocuments = this.documents;
    return;
  }
  
  const term = this.searchTerm.toLowerCase().trim();
  this.filteredDocuments = this.documents.filter(doc => 
    doc.originalname.toLowerCase().includes(term) || 
    this.getDocumentType(doc.mimetype).toLowerCase().includes(term)
  );
}

/**
 * Méthode pour gérer la sélection de fichier
 */
onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.previewFile(event);
  }
}
}
