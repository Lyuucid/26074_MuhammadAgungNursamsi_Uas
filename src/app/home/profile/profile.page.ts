import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {AngularFireDatabase} from '@angular/fire/database';
import {map} from 'rxjs/operators';
import firebase from 'firebase';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {Router} from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userEmail: string;
  users: any;
  userId: any;
  names: any;
  usernames: any;
  photoProfile: any;
  totalPoints: any;
  mainuser: AngularFirestoreDocument;
  checkinDate: any;
  place: any;



  constructor(
      public authService: AuthenticationService,
      public afDatabase: AngularFireDatabase
  ) { }


  ngOnInit() {

    this.authService.getUserData().snapshotChanges().pipe(
        map(changes =>
            changes.map(c => ({user_id: c.payload.key, ...c.payload.val()}))
        )
    ).subscribe(() => {
      this.userId = firebase.auth().currentUser.uid;
      console.log('USER ID CURRENT', this.userId);
      this.afDatabase.database.ref('users/' + this.userId).once('value').then( userDetailsAsObject => {

        this.names = userDetailsAsObject.val().name;
        this.userEmail = userDetailsAsObject.val().emails;
        this.usernames = userDetailsAsObject.val().usernames;
        this.photoProfile = userDetailsAsObject.val().photo_profile;
        this.totalPoints = userDetailsAsObject.val().total_points;


        this.afDatabase.database.ref('users/' + this.userId + '/checkin_history').once('value').then((dataSnapshot) => {
// This to get key generated from firebase after push data in checkin
          const keyLoc = Object.keys(dataSnapshot.val());
          const locationList: string[] = [];

          console.log('LOCATION KEY', keyLoc);
          keyLoc.forEach((child) => {
            this.afDatabase.database.ref('users/' + this.userId + '/checkin_history/' + child).once('value').then((snapshot) => {
              this.checkinDate = snapshot.val().checkin_date;
              this.place = snapshot.val().place;
              return false;
            });
          });
        })

      }).catch( err => {
        console.log('Error pulling /profile table inside functionName() inside componentName.component.ts');
        console.log(err);
      });
    });
  }

}
