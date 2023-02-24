import { Injectable } from '@angular/core';
import { Account } from 'src/app/model';
import { environment } from 'src/environments/environment';
import { AbstractPageGuardService } from '../abstract-page-guard/abstract-page-guard.service';

@Injectable({
  providedIn: 'root'
})
export class IsAdminService extends AbstractPageGuardService {
  override _canActivate(account: Account | null): boolean {
    return account !== null && account.userId === environment.adminUserType;
  }
}
