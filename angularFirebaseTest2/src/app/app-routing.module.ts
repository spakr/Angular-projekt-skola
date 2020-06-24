import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule, CanDeactivate } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

import { UsersTableComponent } from './users-table/users-table.component';
import { DeactivateGuard } from './guards/deactivate.guard';


const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  
  {path: 'profile', component: ProfileComponent },
  {path: 'editProfile', component: EditProfileComponent},
  
  {path: 'register', component: RegisterComponent, canDeactivate: [DeactivateGuard] },
  {path: 'login', component: LoginComponent},
  {path: 'users', component: UsersTableComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { }
