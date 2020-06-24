import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { User } from 'src/entities/User';
import { Observable, from, Subject, BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { DataSnapshot } from '@angular/fire/database/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UsersServerService {

  users: AngularFireList<User> = null;

  
  dbPath = '/users';

  
  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth, private router: Router) {
    
    this.users = db.list(this.dbPath);
  }

 
  public status: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  
  changeData(value: boolean) {
    this.status.next(value);
  }

  
  getUser(uid: string): Observable<any> {
    
     return this.db.list('users', ref => {
       
       return ref
       
       .orderByChild('uid')
       
       .equalTo(uid)
       
       .limitToFirst(1);
      }).valueChanges();
      
  }

  getUsers(): Observable<any> {
    return this.db.list('users', ref => {
      return ref
      .orderByChild('uid');
    }).valueChanges();
  }

 
  updateUser( _name: string, _email: string, _active: boolean, uid: string): Observable<any> {
    const ref = firebase.database().ref('users');
    this.afAuth.auth.currentUser.updateEmail(_email);
    return from(ref.orderByChild('uid').equalTo(uid).once('value', snapshot => {
      snapshot.forEach( user => {
        user.ref.update({
          name: _name,
          email: _email,
          active: _active
        });
      });
    })
  );
}

 
  SignUp(user: User) {
    
    this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
      
      .then((result) => {

        
        this.users.push({
          email: user.email,
          name: user.name,
          uid: result.user.uid,
          password: user.password,
          active: user.active
        });

        
        this.router.navigate(['login']);
        
      }).catch((error) => {
        
        window.alert(error.message);
      });
  }

  
  SignIn(user) {
    
    return this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
      .then((result) => {

          
          this.saveUserToLocalStorage(result);

          
          this.router.navigate(['profile']);
      }).catch((error) => {
        
        window.alert(error.message);
      });
  }

  
  SignOut(): Observable<void> {
    
    return from(this.afAuth.auth.signOut().then(() => {
      
      this.removeFromLocalStorage();
      
      this.router.navigate(['login']);
    }));
}

  
  saveUserToLocalStorage(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  
  getUserFromLocalStorage() {
    return JSON.parse(localStorage.getItem('user'));
  }

  
  removeFromLocalStorage(): void {
    localStorage.clear();
  }

  deleteUser(user: User): Observable<any> {
    const ref = firebase.database().ref('users');
    return from(ref.orderByChild('uid').equalTo(user.uid).once('value', snapshot => {
      snapshot.forEach( user => {
        user.ref.remove();
      });
    })
  );
}

}

