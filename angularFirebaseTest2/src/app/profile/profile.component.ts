import { Component, OnInit } from '@angular/core';
import { UsersServerService } from '../../services/users-server.service';
import { User } from 'src/entities/User';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  
  uid: string;

  
  user: User;

  constructor(private userServerService: UsersServerService) { }

  ngOnInit() {

    // console.log(this.userServerService.getUserFromLocalStorage().user.uid);

    
    this.uid = this.userServerService.getUserFromLocalStorage().user.uid;

    
    if (this.uid != null) {
      
      this.userServerService.getUser(this.uid).subscribe(data => {
        
        this.user = data[0] as User;
    });
    }
  }
}
