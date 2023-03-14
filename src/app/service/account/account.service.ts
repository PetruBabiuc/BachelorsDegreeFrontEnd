import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Account, LoginResponse } from 'src/app/model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private static ACCOUNT_KEY = 'account';

  private jwtHelper = new JwtHelperService();
  private accountSubject: BehaviorSubject<Account | null>;

  constructor(private http: HttpClient) {
    let account = JSON.parse(localStorage.getItem(AccountService.ACCOUNT_KEY)!);
    if (account && this.jwtHelper.isTokenExpired(account.jwt)) {
      account = null;
      localStorage.removeItem(AccountService.ACCOUNT_KEY);
    }

    this.accountSubject = new BehaviorSubject(
      account
    );
  }

  getCurrentAccount(): Account | null {
    return this.accountSubject.getValue();
  }

  getObservableAccount(): Observable<Account | null> {
    return this.accountSubject.asObservable();
  }

  login(userName: string, password: string): Observable<Account> {
    return this.http.post<LoginResponse>(environment.loginUrl, {
      user_name: userName,
      password: password
    })
      .pipe(
        map(
          response => {
            const account = this.jwtToAccount(response.jwt);
            localStorage.setItem(AccountService.ACCOUNT_KEY, JSON.stringify(account));
            this.accountSubject.next(account);
            return account;
          }
        ));
  }

  logOut(): void {
    this.http.post(environment.logoutUrl, {}).subscribe(() => this.clearLocalStorage());
  }

  clearLocalStorage(): void {
    this.accountSubject.next(null);
    localStorage.removeItem(AccountService.ACCOUNT_KEY);
  }

  register(userName: string, password: string): Observable<null> {
    return this.http.post<null>(environment.registerUrl, {
      user_name: userName,
      password: password
    });
  }

  private jwtToAccount(jwt: string): Account {
    const payload = this.jwtHelper.decodeToken(jwt);
    return {
      userId: payload.user_id,
      userName: payload.sub,
      isActive: payload.is_active,
      typeId: payload.user_type_id,
      exp: payload.exp,
      jwt: jwt
    };
  }
}
