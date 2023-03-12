import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { UserCredentials } from 'src/app/model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {
  @Input() panelHeader: string = 'User Form';
  @Input() userName: string = '';
  @Input() password: string = '';
  @Output() onFormSubmitted = new EventEmitter<UserCredentials>();

  userForm = this.fb.group({
    userName: ['', Validators.compose([Validators.required, Validators.maxLength(30), Validators.minLength(5)])],
    password: ['', Validators.compose([Validators.required, Validators.maxLength(30), Validators.minLength(5)])]
  });

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) {

  }

  ngAfterViewInit(): void {
    const controls = this.userForm.controls;
    Object.values(controls).forEach(c => {
      c.markAsTouched();
      c.markAsDirty();
      c.updateValueAndValidity();
    });

    this.userForm.markAsTouched();
    this.userForm.markAsDirty();
    this.userForm.updateValueAndValidity();

    this.cdRef.detectChanges();
  }

  onSubmit() {
    if (!this.userForm.valid)
      return;

    const userName = this.userForm.controls.userName.value;
    const password = this.userForm.controls.password.value;

    this.onFormSubmitted.emit({ userName: userName!, password: password! });
  }
}