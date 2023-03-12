import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserCredentials } from 'src/app/model';
import { AccountService } from 'src/app/service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(
    private router: Router,
    private accountService: AccountService,
    private messageService: MessageService
  ) {

  }

  onSubmit(userCredential: UserCredentials) {
    this.accountService.register(userCredential.userName, userCredential.password)
      .subscribe(
        _ => {
          this.messageService.add({
            severity: 'success',
            summary: 'Registered successfully'
          });
          this.router.navigateByUrl('/login');
        },
        _ => {
          this.messageService.add({
            severity: 'error',
            summary: 'Registration failed',
            detail: 'Username already taken...'
          });
        });
  }
}
