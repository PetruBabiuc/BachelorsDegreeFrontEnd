import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConsumedService, PaidService } from 'src/app/model';
import { environment } from 'src/environments/environment';
import { AccountService } from '../account/account.service';

@Injectable({
  providedIn: 'root'
})
export class PaidServiceService {
  private servicesSubject: BehaviorSubject<PaidService[]>;
  private currentUserConsumedServicesSubject: BehaviorSubject<ConsumedService[]>;
  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {
    this.servicesSubject = new BehaviorSubject<PaidService[]>([]);
    this.currentUserConsumedServicesSubject = new BehaviorSubject<ConsumedService[]>([]);
  }

  getServices(): PaidService[] {
    return this.servicesSubject.getValue();
  }

  getServicesObservable(): Observable<PaidService[]> {
    return this.servicesSubject.asObservable();
  }

  getCurrentUserConsumedServices(): ConsumedService[] {
    return this.currentUserConsumedServicesSubject.getValue();
  }

  getCurrentUserConsumedServicesObservable(): Observable<ConsumedService[]> {
    return this.currentUserConsumedServicesSubject.asObservable();
  }

  refreshCurrentUserConsumedServices(): void {
    const currentAccount = this.accountService.getCurrentAccount();
    const userId = currentAccount?.userId;
    this.http.get<any[]>(`${environment.allUsersUrl}/${userId}/services`).subscribe(resp =>
      this.currentUserConsumedServicesSubject.next(this.mapToConsumedServiceArray(resp))
    );
  }

  refreshServices(): void {
    this.http.get<any[]>(environment.servicesUrl).subscribe(services =>
      this.servicesSubject.next(this.mapToPaidServiceArray(services))
    );
  }

  private mapToPaidServiceArray(response: any[]): PaidService[] {
    return response.map(s => ({
      serviceId: s.service_id,
      serviceName: s.service_name,
      price: s.price
    }));
  }

  private mapToConsumedServiceArray(response: any[]): ConsumedService[] {
    return response.map(s => ({
      serviceId: s.service_id,
      userId: s.user_id,
      quantity: s.quantity
    }));
  }
}
