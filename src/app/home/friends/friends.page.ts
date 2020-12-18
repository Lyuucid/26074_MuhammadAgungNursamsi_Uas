import { Component, OnInit } from '@angular/core';
import {AngularFirestoreDocument} from '@angular/fire/firestore';
import {AuthenticationService} from '../authentication.service';
import {AngularFireDatabase} from '@angular/fire/database';
import {debounceTime, map} from 'rxjs/operators';
import firebase from 'firebase';
import {FormControl} from '@angular/forms';
import {FriendService} from '../friend.service';
import {UserService} from '../user.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {
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
  searchControl: FormControl;
  friendList= [];
  userFriend = [];
  userList = [];
  resetFriend = [];
  friend: any;
  searchFriend: any;
  user_id;

  constructor(
      public authService: AuthenticationService,
      public afDatabase: AngularFireDatabase,
      private friendSrv: FriendService,
      private userSrv: UserService
  ) {
    this.searchControl = new FormControl();
  }


  ngOnInit() {

    // this.authService.userDetails().subscribe(res => {
    //   console.log(res);
    //   if(res !== null){
    //     this.userId = res.uid;
    //
    //     this.friendSrv.getAllFriend(this.userId).snapshotChanges().pipe(
    //         map(changes =>
    //             changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
    //         )
    //     ).subscribe(data => {
    //       this.friend = data;
    //       this.userFriend = this.friend;
    //       console.log(this.userFriend);
    //
    //       this.userSrv.getAllUser().snapshotChanges().pipe(
    //           map(changes =>
    //               changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
    //           )
    //       ).subscribe(data => {
    //         this.userData = data;
    //         this.userList = this.userData;
    //         console.log(this.userList, this.userFriend[0].email);
    //         let j = 0;
    //         for(let i = 0; i < this.userList.length;){
    //           if(this.userList[i].email == this.userFriend[j].email){
    //             console.log('sama');
    //             this.friendList[j] = this.userData[j];
    //             this.resetFriend[j] = this.userData[j];
    //             console.log(this.friendList[j]);
    //             i=0;
    //             j++;
    //             if(j == this.userFriend.length){
    //               break;
    //             }
    //           }else{
    //             i++;
    //           }
    //         }
    //
    //         this.setFilteredItems("");
    //         this.searchControl.valueChanges.pipe(debounceTime(200)).subscribe(search => {
    //           this.setFilteredItems(search);
    //         });
    //         //this.compareData(this.friend.length, this.userData.length);
    //       });
    //     });
    //   }
    // })

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
  setFilteredItems(searchTerm: string) {
    this.friendList = this.resetFriend;
    this.friendList = this.friendList.filter(item => {
      return item.nama.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    })
  }
}

