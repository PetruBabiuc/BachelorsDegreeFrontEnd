import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AccountService } from '../../account/account.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private accountService: AccountService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Add auth header with JWT if account is logged in and request is to one of the APIs
        const account = this.accountService.getCurrentAccount();
        const isLoggedIn = account !== null;
        const isApiUrl = request.url.startsWith(environment.databaseRootUrl)
            || request.url.startsWith(environment.controllerRootUrl);

        if (isLoggedIn && isApiUrl)
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${account.jwt}` }
            });

        return next.handle(request);
    }
}