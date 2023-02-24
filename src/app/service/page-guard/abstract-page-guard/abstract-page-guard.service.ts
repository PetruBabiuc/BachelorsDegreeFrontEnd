import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Account } from 'src/app/model';
import { AccountService } from '../../account/account.service';

@Injectable({
  providedIn: 'root'
})
export class AbstractPageGuardService implements CanActivate {

  constructor(
    private accountService: AccountService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const account = this.accountService.getCurrentAccount();
    const canActivate = this._canActivate(account);
    if (!canActivate)
      this.router.navigateByUrl('/home');
    return canActivate;
  }

  _canActivate(account: Account | null): boolean {
    throw new Error('Abstract method not overriden!');
  }
}
