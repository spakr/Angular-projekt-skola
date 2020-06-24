import { Component, OnInit } from '@angular/core';
import { UsersServerService } from '../../services/users-server.service';
import { fromEvent, forkJoin } from 'rxjs';
import { storage } from 'firebase';
import { Router } from '@angular/router';
import { User } from 'src/entities/User';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

  
  loggedUser: User;
  admin: boolean;

  constructor(private usersServerService: UsersServerService, private router: Router) { }

  ngOnInit() {

    this.usersServerService.status.subscribe((val) => {
        this.loggedUser = this.usersServerService.getUserFromLocalStorage();
    });
  }

  logout() {
    
    this.usersServerService.SignOut().subscribe(() => {
      
      this.loggedUser = new User();
      console.log(this.loggedUser);
      this.usersServerService.changeData(false);
    });
  }

}
