import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {

  loginForm = this.fb.group({
    userName: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {

  }

  ngAfterViewInit(): void {
    const controls = this.loginForm.controls;
    Object.values(controls).forEach(c => {
      c.markAsTouched();
      c.markAsDirty();
      c.updateValueAndValidity();
    });

    this.loginForm.markAsTouched();
    this.loginForm.markAsDirty();
    this.loginForm.updateValueAndValidity();

    this.cdRef.detectChanges();
  }

  onSubmit() {
    if (!this.loginForm.valid)
      return;

    const userName = this.loginForm.controls.userName.value;
    const password = this.loginForm.controls.password.value;

    this.accountService.login(userName!, password!).subscribe(
      account => this.router.navigateByUrl('/home'),
      error => {
        if (error.status === 401)
          alert('Invalid credentials!');
        else
          throw error;
      }
    )
  }
}
