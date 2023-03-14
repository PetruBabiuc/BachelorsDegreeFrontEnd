import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Bill } from 'src/app/model';
import { environment } from 'src/environments/environment';
import { AccountService } from '../account/account.service';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  private ownBillsSubject: BehaviorSubject<Bill[]>;

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {
    this.ownBillsSubject = new BehaviorSubject<Bill[]>([]);
    this.accountService.getObservableAccount().subscribe(() => this.ownBillsSubject.next([]));
   }

   getOwnBills(): Bill[] {
    return this.ownBillsSubject.getValue();
   }

   getOwnBillsObservable(): Observable<Bill[]> {
    return this.ownBillsSubject.asObservable();
   }

   refreshOwnBills(): void {
    const userId = this.accountService.getCurrentAccount()?.userId;
    this.http.get<any[]>(`${environment.allUsersUrl}/${userId}/bills`).subscribe(resp => 
      this.ownBillsSubject.next(this.mapResponse(resp)));
   }

   private mapResponse(resp: any[]): Bill[] {
    return resp.map(b => ({
      billId: b.bill_id,
      userId: b.user_id,
      isPaid: b.is_paid,
      price: b.price,
      issueDate: new Date(b.issue_date),
      deadline: new Date(b.deadline)
    }));
   }
}
