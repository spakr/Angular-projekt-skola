import { Component, OnInit } from '@angular/core';
import { UsersServerService } from '../../services/users-server.service';
import * as zxcvbn from 'zxcvbn';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { User } from 'src/entities/User';
import { CanDeactivateComponent } from '../guards/deactivate.guard';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, CanDeactivateComponent {

  constructor(private usersServerService: UsersServerService) { }

  passwordMsg = '';

  
  userToSend = new User();

  registerForm = new FormGroup({

    
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),

    email: new FormControl('', [
      
      Validators.required,
      
      Validators.email,
      
      Validators.pattern('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}')
    ]),
                                  
    password: new FormControl('', this.passValidator()),
    password2: new FormControl('')
    },
      
      this.passwordsMatchValidator
  );

  
  get name() {
    return this.registerForm.get('name');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get password2() {
    return this.registerForm.get('password2');
  }

  
  passValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      const passTest = zxcvbn(control.value);
      const message = `Password strength / 4 - must be 3 or 4,
      ${passTest.feedback.warning}`;
      this.passwordMsg = message;
      return passTest.score > 3 ? { weakPassword : message} : null;
    };
  }

  
  passwordsMatchValidator(control: FormGroup): ValidationErrors {
    const password = control.get('password');
    const password2 = control.get('password2');
    if (password.value === password2.value) {
      password2.setErrors(null);
      return null;
    } else {
      password2.setErrors({ differentPasswords: 'Passwords do not match' });
      return { differentPasswords: 'Passwords do not match' };
    }
  }

  ngOnInit() {

  }

  submitForm() {

      console.log(
        `${this.email.value}\n${this.password.value}\n${this.name.value}`
      );

      
      this.userToSend.name = this.name.value;
      this.userToSend.email = this.email.value;
      this.userToSend.password = this.password.value;
      this.userToSend.active = true;

      
      this.usersServerService.SignUp(this.userToSend);
  }

  
  canDeactivate(): boolean | Observable<boolean> {

    
    if (this.name.value && this.email.value && this.password.value && this.password2.value) {
      return true;
    }

    
    if (!this.name.value && !this.email.value && !this.password.value && !this.password2.value) {
      return true;
    }

    
    return window.confirm('Form was not completed, wanna leave?');
  }

}
