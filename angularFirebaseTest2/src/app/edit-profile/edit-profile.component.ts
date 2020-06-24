import { Component, OnInit } from '@angular/core';
import { User } from 'src/entities/User';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersServerService } from '../../services/users-server.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  
  uid: string;

  editForm = new FormGroup({
    
    name: new FormControl(
      '', [Validators.required, Validators.minLength(3)]
    ),
    
    email: new FormControl(
      '', [Validators.required, Validators.email, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$')]
    ),
    active: new FormControl('', Validators.required),
  });

  
  get name() {
    return this.editForm.get('name');
  }

  
  get email() {
    return this.editForm.get('email');
  }

  
  get active() {
    return this.editForm.get('active');
  }

  
  constructor(private userServerService: UsersServerService, private router: Router) { }

  ngOnInit() {
      
      this.uid = this.userServerService.getUserFromLocalStorage().user.uid;
      
      this.userServerService.getUser(this.uid).subscribe( user => {
          
          const tempUser: User = user[0] as User;
         
          this.name.setValue(tempUser.name);
          this.email.setValue(tempUser.email);
          this.active.setValue(tempUser.active);
      });
  }

  
  submitForm() {
      
      this.userServerService.updateUser(this.name.value, this.email.value, this.active.value, this.uid).subscribe( () => {
          
          this.router.navigateByUrl('/profile');
      });
  }

}
