import {Injectable, NgZone} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {User} from './user';
import firebase from 'firebase';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userData: any;
  userRef: AngularFireList<User> = null;
  user_id : string;
  email;
  username;

  name;
  id;

  private afAuth: any;

  constructor(
      public afStore: AngularFirestore,
      private fireAuth: AngularFireAuth,
      public ngFireAuth: AngularFireAuth,
      public router: Router,
      public ngZone: NgZone,
      public db: AngularFireDatabase
  ) {
    this.userRef = db.list('users/');
    this.ngFireAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'))
      }
    });
  }

  // Login in with email/password
  SignIn(email, password) {
    return this.ngFireAuth.signInWithEmailAndPassword(email, password)
  }



  RegisterUser(email, password, name, username) {
    return firebase.auth().createUserWithEmailAndPassword(email, password).then((user) => {
      if (user) {
        console.log(user);
        this.user_id = user['user'].uid;
        this.email = user['user'].email;

        // inserting into database
        firebase.database().ref('users/' + this.user_id).set({
          name: name,
          usernames: username,
          emails: email,
          total_points: 0,
          photo_profile: 'https://firebasestorage.googleapis.com/v0/b/baticca-755ef.appspot.com/o/Profile%2Fbalinese.svg?alt=media&token=ff7bf262-f05c-4780-ba9f-e7cac9a460ce'
        }, (error) => {
          if (error) {
            console.log(error);
          } else {
            console.log('New User Saved');
          }
        });
      }
      return user;
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      return errorMessage;
      // ...
    });
  }

  // Email verification when new user register
  SendVerificationMail() {
    return firebase.auth().currentUser.sendEmailVerification()
        .then(() => {
          this.router.navigate(['home/verify-email']);
        })
  }

  // Recover password
  PasswordRecover(passwordResetEmail) {
    return this.ngFireAuth.sendPasswordResetEmail(passwordResetEmail)
        .then(() => {
          window.alert('Password reset email has been sent, please check your inbox.');
        }).catch((error) => {
          window.alert(error);
        });
  }

  // Returns true when user is looged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  // Returns true when user's email is verified
  get isEmailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user.emailVerified !== false) ? true : false;
  }


  // Sign-out navigate to home landing page
  SignOut() {
    return this.ngFireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/']);
    });
  }

  getUserData(): AngularFireList<User> {
    return this.userRef;
  }

  userDetails(){
    return this.fireAuth.user;
  }

}
