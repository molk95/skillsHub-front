import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Forum } from '../models/forums.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private apiUrl = environment.BASE_URL_API + 'forums';

  constructor(private http: HttpClient) {}

  // Récupérer tous les forums
  async getAllForums(): Promise<Forum[] | undefined> {
    try {
      const response = await this.http.get<any>(this.apiUrl).toPromise();
      console.log('Réponse brute de l\'API forums:', response);

      // Vérifier si la réponse a une structure avec data
      let forums;
      if (response && response.data && Array.isArray(response.data)) {
        forums = response.data;
      } else if (Array.isArray(response)) {
        forums = response;
      } else {
        console.error('Format de réponse inattendu:', response);
        return [];
      }

      // Assurez-vous que chaque forum a un ID valide
      return forums.map((forum: any) => ({
        ...forum,
        id: forum._id || forum.id // Utiliser _id de MongoDB si disponible
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des forums:', error);
      // Retourner un tableau vide au lieu de lancer une erreur
      return [];
    }
  }

  // Récupérer un forum par son ID
  async getForumById(id: string): Promise<Forum | undefined> {
    try {
      return await this.http.get<Forum>(`${this.apiUrl}/${id}`).toPromise();
    } catch (error) {
      console.error(`Erreur lors de la récupération du forum ${id}:`, error);
      throw error;
    }
  }

  // Créer un nouveau forum
  async createForum(forum: Forum): Promise<Forum | undefined> {
    try {
      return await this.http.post<Forum>(this.apiUrl, forum).toPromise();
    } catch (error) {
      console.error('Erreur lors de la création du forum:', error);
      throw error;
    }
  }

  // Mettre à jour un forum
  async updateForum(id: string, forum: Forum): Promise<Forum | undefined> {
    try {
      return await this.http.put<Forum>(`${this.apiUrl}/${id}`, forum).toPromise();
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du forum ${id}:`, error);
      throw error;
    }
  }

  // Supprimer un forum
  async deleteForum(id: string): Promise<void> {
    try {
      await this.http.delete<void>(`${this.apiUrl}/${id}`).toPromise();
    } catch (error) {
      console.error(`Erreur lors de la suppression du forum ${id}:`, error);
      throw error;
    }
  }

  // Récupérer des forums par tag
  async getForumsByTag(tag: string): Promise<Forum[] | undefined> {
    try {
      return await this.http.get<Forum[]>(`${this.apiUrl}/tags/${tag}`).toPromise();
    } catch (error) {
      console.error(`Erreur lors de la récupération des forums par tag ${tag}:`, error);
      throw error;
    }
  }
}
