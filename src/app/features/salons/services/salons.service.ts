import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError, tap, of, delay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ISalon } from '../models/salons.model';

// Ajoute cette interface pour tes documents

export interface IReactions {
  like: string[];
  success: string[];
  love: string[];
}
export interface IDocument {
  mimetype: any;
  _id: string;
  filename: string;
  originalname: string;
  url: string;
  size: number;
  salonId: string;
  commentaires?: ICommentaire[]; 
  etoiles?: number; 
}

export interface ICommentaire {
  _id: string;
  auteur: string;
  texte: string;
  date: Date;
  reactions?: IReactions; 
  userReactions?: { like: boolean; success: boolean; love: boolean };
}

@Injectable({
  providedIn: 'root',
})
export class SalonsService {
  private baseUrl = `${environment.BASE_URL_API}salons`;
  private documentUrl = `${environment.BASE_URL_API}document`;
  private apiUrl = 'http://localhost:3000/api/salons'; // adapte l'URL à ton backend

  constructor(private http: HttpClient) {}

  // ➕ Ajouter un salon
  searchSalons(filters: any): Observable<ISalon[]> {
    let params = new HttpParams();
    
    // Ajouter les filtres à la requête
    Object.keys(filters).forEach(key => {
      if (filters[key]) params = params.set(key, filters[key]);
    });
    
    console.log('Recherche de salons avec les filtres:', filters);
    console.log('URL de recherche:', `${this.baseUrl}/search`, { params });
    
    return this.http.get<ISalon[]>(`${this.baseUrl}/search`, { params }).pipe(
      tap(salons => console.log('Résultats de recherche:', salons)),
      catchError(error => {
        console.error('Erreur lors de la recherche de salons:', error);
        
        // Message d'erreur plus descriptif
        let errorMsg = 'Erreur lors de la recherche de salons';
        if (error.status === 500) {
          errorMsg = 'Erreur serveur lors de la recherche. Veuillez réessayer plus tard.';
        } else if (error.status === 404) {
          errorMsg = 'Aucun salon trouvé avec ces critères.';
        }
        
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  addSalon(salon: ISalon): Observable<ISalon> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<ISalon>(this.baseUrl, salon, { headers }).pipe(
      catchError((error) => {
        console.error('Erreur lors de l\'ajout du salon :', error);
        return throwError(() => error);
      })
    );
  }

getAllDocuments(): Observable<IDocument[]> {
  return this.http.get<IDocument[]>('http://localhost:3000/api/document');
}

  // Récupérer les salons avec leurs sessions associées
  getSalonsWithSessions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/salons-with-sessions`);
  }

  // 📋 Récupérer tous les salons
  getAllSalons(): Observable<ISalon[]> {
    console.log(`Tentative de récupération des salons depuis: ${this.baseUrl}`);
    return this.http.get<ISalon[]>(this.baseUrl).pipe(
      tap(response => console.log('Réponse du serveur pour getAllSalons:', response)),
      catchError((error) => {
        console.error('Erreur détaillée lors de la récupération des salons:', error);
        return throwError(() => error);
      })
    );
  }

  // 🔍 Récupérer un salon par nom
  getSalonByName(name: string): Observable<ISalon[]> {
    const encodedName = encodeURIComponent(name);
    console.log(`Tentative de récupération du salon avec le nom "${name}" depuis: ${this.baseUrl}/nom/${encodedName}`);
    return this.http.get<ISalon[]>(`${this.baseUrl}/nom/${encodedName}`).pipe(
      catchError((error) => {
        console.error(`Erreur lors de la récupération du salon avec le nom "${name}":`, error);
        return throwError(() => error);
      })
    );
  }


  // 🔄 Mettre à jour un salon par nom
  updateSalonByName(nom: string, data: { description: string }): Observable<ISalon> {
    const encodedName = encodeURIComponent(nom);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<ISalon>(`${this.baseUrl}/nom/${encodedName}`, data, { headers }).pipe(
      catchError((error) => {
        console.error(`Erreur lors de la mise à jour du salon avec le nom "${nom}":`, error);
        return throwError(() => error);
      })
    );
  }

  // 🗑️ Supprimer un salon par nom
  deleteSalonByName(name: string): Observable<void> {
    const encodedName = encodeURIComponent(name);
    return this.http.delete<void>(`${this.baseUrl}/nom/${encodedName}`).pipe(
      catchError((error) => {
        console.error(`Erreur lors de la suppression du salon avec le nom "${name}":`, error);
        return throwError(() => error);
      })
    );
  }

  // Obtenir tous les documents d'un salon
  getDocumentsBySalon(salonId: string): Observable<IDocument[]> {
    console.log(`Récupération des documents pour le salon ${salonId}`); // Ajout de log pour debug
    return this.http.get<IDocument[]>(`${this.documentUrl}/salon/${salonId}`).pipe(
      tap(docs => console.log('Documents récupérés:', docs)), // Ajout de log pour debug
      catchError(err => {
        console.error('Erreur lors de la récupération des documents:', err);
        return throwError(() => new Error('Erreur lors de la récupération des documents'));
      })
    );
  }

uploadSalonFile(file: File, salonId: string): Observable<any> {
  const formData = new FormData();
  formData.append('file', file);
  
  // Ajout de logs pour déboguer
  console.log('Uploading file:', file.name, 'size:', file.size, 'type:', file.type);
  console.log('To salon ID:', salonId);
  
  // Vérification du type de fichier
  if (!file.type.startsWith('application/pdf') && 
      !file.type.startsWith('video/') && 
      !file.type.startsWith('image/')) {
    console.error('Type de fichier non supporté:', file.type);
    return throwError(() => new Error('Type de fichier non supporté'));
  }
  
  // Augmentation de la limite à 50MB (50 * 1024 * 1024 octets)
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB en octets
  if (file.size > MAX_FILE_SIZE) {
    console.error('Fichier trop volumineux:', file.size);
    return throwError(() => new Error(`Fichier trop volumineux (max ${MAX_FILE_SIZE / (1024 * 1024)}MB)`));
  }
  
  return this.http.post(`${this.documentUrl}/upload/${salonId}`, formData)
    .pipe(
      catchError(error => {
        console.error('Erreur lors de l\'upload:', error);
        if (error.status === 500) {
          return throwError(() => new Error('Erreur serveur lors de l\'upload. Veuillez réessayer.'));
        } else if (error.status === 400) {
          return throwError(() => new Error('Requête incorrecte. Vérifiez le format du fichier.'));
        } else if (error.status === 413) {
          return throwError(() => new Error('Fichier trop volumineux pour le serveur.'));
        }
        return throwError(() => error);
      })
    );
}

  // Supprimer un document
  deleteDocument(id: string) {
    return this.http.delete(`${this.documentUrl}/${id}`);
  }

getCommentaires(documentId: string) {
  return this.http.get<ICommentaire[]>(`http://localhost:3000/api/document/${documentId}/commentaires`);
}

addCommentaire(documentId: string, commentaire: { auteur: string; texte: string }) {
  return this.http.post<ICommentaire>(`http://localhost:3000/api/document/${documentId}/commentaires`, commentaire);
}
deleteCommentaire(documentId: string, commentaireId: string) {
  return this.http.delete(
    `http://localhost:3000/api/document/${documentId}/commentaires/${commentaireId}`
  );
}

addEtoile(documentId: string) {
  return this.http.post<{ etoiles: number }>(
    `http://localhost:3000/api/document/${documentId}/etoile`, {}
  );
}

// Ajoute une réaction (like, success ou love) à un commentaire
reactToComment(docId: string, commentId: string, reaction: 'like' | 'success' | 'love', userId: string) {
  return this.http.post<{ reactions: any, userReactions: any }>(
    `http://localhost:3000/api/document/${docId}/commentaires/${commentId}/react`,
    { reaction, userId }
  );
}
searchDocumentsByNameInSalon(salonId: string, name: string) {
  return this.http.get<any[]>(`http://localhost:3000/api/document/salon/${salonId}/search?name=${encodeURIComponent(name)}`);
}

/**
 * Envoie une invitation à un ou plusieurs participants
 * @param salonId - L'ID du salon
 * @param emailOrEmails - Un email unique ou un tableau d'emails
 * @returns Observable avec la réponse du serveur
 */
inviterParticipant(salonId: string, emailOrEmails: string | string[]): Observable<any> {
  let payload: any = { salonId };
  
  // Déterminer si c'est un email unique ou un tableau
  if (Array.isArray(emailOrEmails)) {
    payload.emails = emailOrEmails;
  } else {
    payload.email = emailOrEmails;
  }
  
  return this.http.post(`${environment.BASE_URL_API}salons/inviter`, payload).pipe(
    tap(response => {
      console.log('Réponse du serveur après invitation:', response);
    }),
    catchError(error => {
      console.error('Erreur lors de l\'envoi de l\'invitation:', error);
      return throwError(() => new Error('Erreur lors de l\'envoi de l\'invitation. Veuillez réessayer plus tard.'));
    })
  );
}

getSalonById(id: string) {
  return this.http.get<{ _id: string, nom: string }>(`${this.apiUrl}/${id}`);
}

}
