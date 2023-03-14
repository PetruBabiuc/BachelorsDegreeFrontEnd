import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private accountService: AccountService,
    private router: Router
  ) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error instanceof ErrorEvent)
            return throwError(() => new Error(`Client side error: ${error.error.message}`));
          else if ((error.status === 403 || error.status === 401) && request.url !== environment.loginUrl) {
            console.log(`URL: ${request.url}`)
            this.accountService.clearLocalStorage();
            this.router.navigateByUrl('/home');
            return throwError(() => new Error('JWT Expired...'));
          }
          else if (request.url === environment.loginUrl && error.status === 401)
            return throwError(() => new Error('Login failed! Invalid credentials'));
          else
            return throwError(() => error);
        })
      );
  }
}