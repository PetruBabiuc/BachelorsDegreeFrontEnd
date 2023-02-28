import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, retry } from 'rxjs';
import { AccountService } from '../../account/account.service';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private accountService: AccountService
  ) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error instanceof ErrorEvent)
            return throwError(() => new Error(`Client side error: ${error.error.message}`));
          else if (error.status === 403 || error.status === 401) {
            this.accountService.logOut();
            return throwError(() => new Error('JWT Expired...'));
          }
          else
            return throwError(() => new Error(`Server side error: ${error.error.message}`));
        })
      );
  }
}