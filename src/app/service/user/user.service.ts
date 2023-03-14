import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, first, ignoreElements, map, Observable, tap } from 'rxjs';
import { User } from 'src/app/model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersSubject: BehaviorSubject<User[]>;

  constructor(
    private http: HttpClient
  ) {
    this.usersSubject = new BehaviorSubject<User[]>([]);
  }

  getUsers(): User[] {
    return this.usersSubject.getValue();
  }

  getUsersObservable(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  refreshUsers(): Observable<void> {
    return this.http.get<any>(environment.allUsersUrl).pipe(
      map(users => this.usersSubject.next(this.mapResponse(users)))
    );
  }

  toggleActiveStatus(userId: number): Observable<void> {
    return this.http.post<void>(`${environment.allUsersUrl}/${userId}/toggle-active`, {});
  }

  private mapResponse(resp: any[]): User[] {
    return resp.map(u => ({
      userId: u.user_id,
      isActive: u.is_active,
      userName: u.user_name,
      userTypeId: u.user_type_id
    }))
  }
}
