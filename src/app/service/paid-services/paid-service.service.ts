import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PaidService } from 'src/app/model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaidServiceService {
  private servicesSubject: BehaviorSubject<PaidService[]>
  constructor(
    private http: HttpClient
  ) {
    this.servicesSubject = new BehaviorSubject<PaidService[]>([]);
  }

  getServices(): PaidService[] {
    return this.servicesSubject.getValue();
  }

  getServicesObservable(): Observable<PaidService[]> {
    return this.servicesSubject.asObservable();
  }

  refreshServices(): void {
    this.http.get<any[]>(environment.servicesUrl).subscribe(services =>
      this.servicesSubject.next(this.mapResponse(services))
    );
  }

  private mapResponse(response: any[]): PaidService[] {
    return response.map(s => ({
      serviceId: s.service_id,
      serviceName: s.service_name,
      price: s.price
    }));
  }
}
