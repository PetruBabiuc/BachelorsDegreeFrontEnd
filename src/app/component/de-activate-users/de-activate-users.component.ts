import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { concat } from 'rxjs';
import { User } from 'src/app/model';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-de-activate-users',
  templateUrl: './de-activate-users.component.html',
  styleUrls: ['./de-activate-users.component.css', './de-activate-users.component.scss']
})
export class DeActivateUsersComponent implements OnInit {
  users: User[];
  constructor(
    private userService: UserService,
    private messageService: MessageService,
  ) {
    this.users = userService.getUsers();
    this.userService.getUsersObservable().subscribe(users => this.users = users);
  }

  ngOnInit(): void {
    this.userService.refreshUsers().subscribe();
  }

  getUserType(typeId: number): string {
    const userTypes = ['Admin', 'Microservice', 'Simple user']
    return userTypes[typeId - 1];
  }

  toggleActiveStatus(user: User): void {
    this.messageService.add({
      severity: 'info',
      summary: `Changing user ${user.userName}'s active status...`
    })
    this.userService.toggleActiveStatus(user.userId).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: `Changed user ${user.userName} active status!`
      });
      this.userService.refreshUsers().subscribe();
    });
  }
}
