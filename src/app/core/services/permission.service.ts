import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface UserPermissions {
  canCreateCommunity: boolean;
  canModifyCommunity: boolean;
  canDeleteCommunity: boolean;
  canCreateForum: boolean;
  canModifyForum: boolean;
  canDeleteForum: boolean;
  canCreateEvent: boolean;
  canModifyEvent: boolean;
  canDeleteEvent: boolean;
  canCreateComment: boolean;
  canModifyComment: boolean;
  canDeleteComment: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private apiUrl = environment.BASE_URL_API;

  constructor(private http: HttpClient) {}

  /**
   * Vérifier si l'utilisateur est membre d'une communauté
   */
  isUserMemberOfCommunity(userId: string, communityId: string): Observable<boolean> {
    if (!userId || !communityId) {
      return of(false);
    }

    return this.http.get<any>(`${this.apiUrl}communities/${communityId}/members/${userId}`)
      .pipe(
        map(response => {
          // Adapter selon la structure de réponse de votre API
          return response && response.success && response.data === true;
        }),
        catchError(error => {
          console.error('Erreur lors de la vérification du statut de membre:', error);
          return of(false);
        })
      );
  }

  /**
   * Vérifier si l'utilisateur est le créateur d'une entité
   */
  isUserCreatorOf(userId: string, entityAuthorId: string): boolean {
    return userId === entityAuthorId;
  }

  /**
   * Obtenir les permissions d'un utilisateur pour une communauté
   */
  getUserPermissionsForCommunity(userId: string, communityId: string): Observable<UserPermissions> {
    if (!userId) {
      return of(this.getDefaultPermissions());
    }

    return this.isUserMemberOfCommunity(userId, communityId).pipe(
      map(isMember => {
        if (isMember) {
          return this.getMemberPermissions();
        } else {
          return this.getNonMemberPermissions();
        }
      })
    );
  }

  /**
   * Permissions par défaut (utilisateur non connecté)
   */
  private getDefaultPermissions(): UserPermissions {
    return {
      canCreateCommunity: true, // Accessible à tous selon US3
      canModifyCommunity: false,
      canDeleteCommunity: false,
      canCreateForum: false,
      canModifyForum: false,
      canDeleteForum: false,
      canCreateEvent: false,
      canModifyEvent: false,
      canDeleteEvent: false,
      canCreateComment: false,
      canModifyComment: false,
      canDeleteComment: false
    };
  }

  /**
   * Permissions pour les membres d'une communauté
   */
  private getMemberPermissions(): UserPermissions {
    return {
      canCreateCommunity: true,
      canModifyCommunity: true,
      canDeleteCommunity: true,
      canCreateForum: true,
      canModifyForum: true,
      canDeleteForum: true,
      canCreateEvent: true,
      canModifyEvent: true,
      canDeleteEvent: true,
      canCreateComment: true,
      canModifyComment: true,
      canDeleteComment: true
    };
  }

  /**
   * Permissions pour les non-membres
   */
  private getNonMemberPermissions(): UserPermissions {
    return {
      canCreateCommunity: true, // Accessible à tous selon US3
      canModifyCommunity: false,
      canDeleteCommunity: false,
      canCreateForum: false,
      canModifyForum: false,
      canDeleteForum: false,
      canCreateEvent: false,
      canModifyEvent: false,
      canDeleteEvent: false,
      canCreateComment: false,
      canModifyComment: false,
      canDeleteComment: false
    };
  }

  /**
   * Vérifier si l'utilisateur peut modifier une entité spécifique
   */
  canUserModifyEntity(userId: string, entityAuthorId: string, communityId: string, entityType: 'forum' | 'event' | 'comment'): Observable<boolean> {
    // L'utilisateur peut toujours modifier ses propres entités
    if (this.isUserCreatorOf(userId, entityAuthorId)) {
      return of(true);
    }

    // Sinon, vérifier les permissions de la communauté
    return this.getUserPermissionsForCommunity(userId, communityId).pipe(
      map(permissions => {
        switch (entityType) {
          case 'forum':
            return permissions.canModifyForum;
          case 'event':
            return permissions.canModifyEvent;
          case 'comment':
            return permissions.canModifyComment;
          default:
            return false;
        }
      })
    );
  }

  /**
   * Vérifier si l'utilisateur peut supprimer une entité spécifique
   */
  canUserDeleteEntity(userId: string, entityAuthorId: string, communityId: string, entityType: 'forum' | 'event' | 'comment'): Observable<boolean> {
    // L'utilisateur peut toujours supprimer ses propres entités
    if (this.isUserCreatorOf(userId, entityAuthorId)) {
      return of(true);
    }

    // Sinon, vérifier les permissions de la communauté
    return this.getUserPermissionsForCommunity(userId, communityId).pipe(
      map(permissions => {
        switch (entityType) {
          case 'forum':
            return permissions.canDeleteForum;
          case 'event':
            return permissions.canDeleteEvent;
          case 'comment':
            return permissions.canDeleteComment;
          default:
            return false;
        }
      })
    );
  }
}
