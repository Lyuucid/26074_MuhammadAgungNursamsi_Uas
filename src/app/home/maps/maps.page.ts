import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthenticationService } from '../authentication.service';
import { FriendService } from '../friend.service';
import { UserService } from '../user.service';
import { map } from 'rxjs/operators';
import { LoadingController, ToastController } from '@ionic/angular';
import firebase from "firebase";


declare var google: any;
@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {
  map: any;
  infoWindow: any = new google.maps.InfoWindow();
  @ViewChild('map', {read: ElementRef, static: false}) mapRef: ElementRef;
  umnPos: any = {
    lat: -6.256081,
    lng: 106.618755
  };
  checkIn: boolean = false;

  user_id;

  today = new Date();
  todaysDay = String(this.today.getDate()).padStart(2, '0');
  todaysMonth = String(this.today.getMonth() + 1).padStart(2, '0'); // January is 0!
  todaysYear = this.today.getFullYear();
  todaysHour = this.today.getHours();
  todaysMinute = this.today.getMinutes();


  constructor(
      private toastController: ToastController,
      private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
  }


  ionViewDidEnter(){
    this.showMap(this.umnPos);
  }

  showCurrentLoc(){
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: Position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        console.log(pos);
        this.infoWindow.setPosition(pos);
        this.infoWindow.setContent('Kamu disini!');
        this.infoWindow.open(this.map);
        this.map.setCenter(pos);
      });
    }
  }

  showMap(pos: any){
    console.log('test: ', pos);
    const location = new google.maps.LatLng(pos.lat, pos.lng);
    const options = {
      center: location,
      zoom: 15,
      disableDefaultUI: true
    };
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);

    // Marker for UMN
    const marker = new google.maps.Marker({
      position: this.umnPos,
      map: this.map,
    });
  }

  inputCheckIn() {
    this.checkIn = true;
  }

  cancelCheckIn() {
    this.checkIn = false;
  }

  doCheckIn(place) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user && navigator.geolocation) {
        // User logged in already or has just logged in.
        this.user_id = user.uid;
        console.log('===USER ID===', this.user_id);

        navigator.geolocation.getCurrentPosition((position: Position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          firebase.database().ref('users/' + this.user_id + '/checkin_history').push({
            checkin_date: `${this.todaysDay}/${this.todaysMonth}/${this.todaysYear} ${this.todaysHour}:${this.todaysMinute}`,
            location: `${pos.lat}, ${pos.lng}`,
            place: place.value
          }).key;

          console.log('===SUCCESS CHECKIN===', ` At ${pos.lat}, ${pos.lng}`);
        });
      } else {
        // User not logged in or has just logged out.
      }
    });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Berhasil Ditandai!',
      color: 'secondary',
      duration: 4000
    });
    toast.present();
  }

  async presentLoading(place) {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      spinner: 'dots',
      duration: 4000
    });
    await loading.present();

    await loading.onDidDismiss().then(() => {
      this.doCheckIn(place);
      this.cancelCheckIn();
      this.presentToast();
    });
  }
}
