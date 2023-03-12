import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserCredentials } from 'src/app/model';
import { AccountService } from 'src/app/service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(
    private accountService: AccountService,
    private router: Router,
    private messageService: MessageService
  ) {

  }
  onSubmit(userCredentaials: UserCredentials) {
    this.accountService.login(userCredentaials.userName!, userCredentaials.password!).subscribe(
      account => {
        this.messageService.add({
          severity: 'success',
          summary: 'Login successful!'
        });
        this.router.navigateByUrl('/home');
      },
      error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Login failed!',
          detail: 'The credentials were invalid.',
        });
      }
    )
  }
}
