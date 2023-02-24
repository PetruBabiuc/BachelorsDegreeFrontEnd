import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Account } from 'src/app/model';
import { AccountService } from '../../account/account.service';
import { AbstractPageGuardService } from '../abstract-page-guard/abstract-page-guard.service';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedService extends AbstractPageGuardService {
  override _canActivate(account: Account | null): boolean {
    return account !== null;
  }
}
