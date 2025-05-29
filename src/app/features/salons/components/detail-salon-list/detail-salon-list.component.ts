import { Component, OnInit } from '@angular/core';
import { SalonsService, IDocument } from '../../services/salons.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-detail-salon-list',
  templateUrl: './detail-salon-list.component.html',
  styleUrls: ['./detail-salon-list.component.css']
})
export class DetailSalonListComponent implements OnInit {

  documents: IDocument[] = [];
  loading = true;
  error = '';
  selectedPdfUrl: SafeResourceUrl | null = null;

  constructor(
    private salonService: SalonsService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loading = true;
    this.salonService.getAllDocuments().subscribe({
      next: docs => {
        console.log('Documents chargés:', docs);
        this.documents = docs;
        this.loading = false;
      },
      error: err => {
        console.error('Erreur de chargement:', err);
        this.error = 'Erreur lors du chargement des documents: ' + (err.message || err.statusText || 'Erreur inconnue');
        this.loading = false;
      }
    });
  }

  showPdf(url: string) {
    // Si l'URL commence déjà par http, ne rien faire, sinon préfixer (modifie selon ton backend)
    const fullUrl = url.startsWith('http') ? url : 'http://localhost:3000' + url;
    this.selectedPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
  }

  closePdf() {
    this.selectedPdfUrl = null;
  }

   /** Nouvelle méthode pour supprimer un PDF */
  deletePdf(doc: IDocument) {
    if (!confirm(`Voulez-vous vraiment supprimer "${doc.originalname}" ?`)) return;
    this.salonService.deleteDocument(doc._id).subscribe({
      next: () => {
        this.documents = this.documents.filter(d => d._id !== doc._id);
      },
      error: () => {
        alert('Erreur lors de la suppression du document.');
      }
    });
  }
}