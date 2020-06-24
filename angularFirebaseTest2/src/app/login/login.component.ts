import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { UsersServerService } from '../../services/users-server.service';
import { User } from 'src/entities/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private usersServerService: UsersServerService, private router: Router) { }

  userToSend = new User();

 
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', Validators.required)
  });

 
  get email() {
    return this.loginForm.get('email');
  }

  
  get password() {
    return this.loginForm.get('password');
  }

  ngOnInit() {
    
  }

  login() {

    
    this.userToSend.email = this.email.value;
    this.userToSend.password = this.password.value;

    
    this.usersServerService.SignIn(this.userToSend).then(() => {
        this.usersServerService.changeData(true);
    });
  }

  
}
