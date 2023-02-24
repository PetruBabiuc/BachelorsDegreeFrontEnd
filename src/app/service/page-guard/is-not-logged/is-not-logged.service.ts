import { Injectable } from '@angular/core';
import { Account } from 'src/app/model';
import { AbstractPageGuardService } from '../abstract-page-guard/abstract-page-guard.service';

@Injectable({
  providedIn: 'root'
})
export class IsNotLoggedService extends AbstractPageGuardService {
  override _canActivate(account: Account | null): boolean {
    return account === null;
  }
}
