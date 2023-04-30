import { Injectable } from '@nestjs/common';

@Injectable()
export class ConnectionService {
  protected invitations: Map<number, number[]> = new Map<number, number[]>();

  get invitationsMap() {
    return this.invitations;
  }

  public addInvitation(idJoueur: number, idInvited: number): boolean {
    if (this.invitations.has(idInvited)) {
      const invitations = this.invitations.get(idInvited);
      if (invitations) {
        if (invitations.indexOf(idJoueur) > -1) {
          return false;
        }
        invitations.push(idJoueur);
        this.invitations.set(idInvited, invitations);
        return true;
      }
    } else {
      this.invitations.set(idInvited, [idJoueur]);
      return true;
    }
  }

  public removeInvitation(idJoueur: number, idInvited: number) {
    if (this.invitations.has(idInvited)) {
      const invitations = this.invitations.get(idInvited);
      if (invitations) {
        const index = invitations.indexOf(idJoueur);
        if (index > -1) {
          invitations.splice(index, 1);
        }
        this.invitations.set(idInvited, invitations);
      }
    }
  }

  public getInvitations(idJoueur: number) {
    if (this.invitations.has(idJoueur)) {
      return this.invitations.get(idJoueur);
    }
    return [];
  }

  public checkForInvitations(idJoueur: number) {
    if (this.invitations.has(idJoueur)) {
      return this.invitations.get(idJoueur);
    }
    return false;
  }
}
