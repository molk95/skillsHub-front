import { Directive, Input, ElementRef, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PermissionService } from '../../core/services/permission.service';

@Directive({
  selector: '[appPermission]'
})
export class PermissionDirective implements OnInit, OnDestroy {
  @Input() appPermission: string = '';
  @Input() userId: string = '';
  @Input() communityId: string = '';
  @Input() entityAuthorId: string = '';
  @Input() entityType: 'forum' | 'event' | 'comment' | 'community' = 'forum';

  private subscription: Subscription = new Subscription();

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private permissionService: PermissionService
  ) {}

  ngOnInit() {
    this.checkPermission();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private checkPermission() {
    if (!this.userId) {
      this.disableElement();
      return;
    }

    switch (this.appPermission) {
      case 'create':
        this.checkCreatePermission();
        break;
      case 'modify':
        this.checkModifyPermission();
        break;
      case 'delete':
        this.checkDeletePermission();
        break;
      default:
        this.disableElement();
    }
  }

  private checkCreatePermission() {
    if (!this.communityId) {
      this.disableElement();
      return;
    }

    const sub = this.permissionService.getUserPermissionsForCommunity(this.userId, this.communityId)
      .subscribe(permissions => {
        let hasPermission = false;
        
        switch (this.entityType) {
          case 'forum':
            hasPermission = permissions.canCreateForum;
            break;
          case 'event':
            hasPermission = permissions.canCreateEvent;
            break;
          case 'comment':
            hasPermission = permissions.canCreateComment;
            break;
          case 'community':
            hasPermission = permissions.canCreateCommunity;
            break;
        }

        if (!hasPermission) {
          this.disableElement();
        }
      });

    this.subscription.add(sub);
  }

  private checkModifyPermission() {
    if (!this.communityId || !this.entityAuthorId) {
      this.disableElement();
      return;
    }

    const sub = this.permissionService.canUserModifyEntity(
      this.userId, 
      this.entityAuthorId, 
      this.communityId, 
      this.entityType === 'community' ? 'forum' : this.entityType
    ).subscribe(canModify => {
      if (!canModify) {
        this.disableElement();
      }
    });

    this.subscription.add(sub);
  }

  private checkDeletePermission() {
    if (!this.communityId || !this.entityAuthorId) {
      this.disableElement();
      return;
    }

    const sub = this.permissionService.canUserDeleteEntity(
      this.userId, 
      this.entityAuthorId, 
      this.communityId, 
      this.entityType === 'community' ? 'forum' : this.entityType
    ).subscribe(canDelete => {
      if (!canDelete) {
        this.disableElement();
      }
    });

    this.subscription.add(sub);
  }

  private disableElement() {
    // Désactiver le bouton
    this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
    
    // Ajouter des classes CSS pour l'apparence grisée
    this.renderer.addClass(this.el.nativeElement, 'disabled');
    this.renderer.addClass(this.el.nativeElement, 'btn-secondary');
    
    // Ajouter un tooltip explicatif
    this.renderer.setAttribute(
      this.el.nativeElement, 
      'title', 
      'Vous n\'avez pas les permissions nécessaires pour cette action'
    );
    
    // Empêcher les clics
    this.renderer.listen(this.el.nativeElement, 'click', (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
  }
}


