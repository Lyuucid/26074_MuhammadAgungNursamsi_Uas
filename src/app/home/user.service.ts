import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private dbPath = '/users';
  userRef: AngularFireList<User> = null;

  constructor(private db: AngularFireDatabase) {
    this.userRef = db.list(this.dbPath);
   }
   
  upLatLng(lat: number, lng: number, userId: string){
    this.userRef = this.db.list('/user');
    return this.userRef.update(userId, {
      lat: lat,
      lng: lng
    });
  }
  getAllUser(){
    return this.userRef;
  }
  
  getAllUsers(): AngularFireList<User> {
    return this.userRef;
  }
}
