import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AngularFirestoreDocument} from '@angular/fire/firestore';
import {AlertController, Platform} from '@ionic/angular';
import {Router} from '@angular/router';
import firebase from 'firebase';
import {AuthenticationService} from '../authentication.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Camera, CameraResultType, CameraSource, Capacitor} from '@capacitor/core';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  @ViewChild('filePicker', { static: false }) filePickerRef: ElementRef<HTMLInputElement>;
  photo: SafeResourceUrl;
  isDesktop: boolean;

  user_id: any;
  userProfilePicture: any;
  userName: any;

  users: any;
  userId: any;
  names: any;
  usernames: any;
  profilePicture: any;
  getPhoto: any;

  mainuser: AngularFirestoreDocument;

  busy = false;
  password: any;
  newpassword: any;

  constructor(
      private alertController: AlertController,
      private user: AuthenticationService,
      private router: Router,
      private authService: AuthenticationService,
      private afDatabase: AngularFireDatabase,
      private alertCtrl: AlertController,
      private platform: Platform,
      private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {

    if ((this.platform.is('mobile') && this.platform.is('hybrid')) ||
        this.platform.is('desktop')) {
      this.isDesktop = true;
    }

    this.authService.getUserData().snapshotChanges().pipe(
        map(changes =>
            changes.map(c => ({user_id: c.payload.key, ...c.payload.val()}))
        )
    ).subscribe(() => {
      this.userId = firebase.auth().currentUser.uid;
      console.log('USER ID CURRENT', this.userId);
      this.afDatabase.database.ref('users/' + this.userId).once('value').then( userDetailsAsObject => {

        this.names = userDetailsAsObject.val().names;
        this.usernames = userDetailsAsObject.val().usernames;
        this.profilePicture = userDetailsAsObject.val().photo_profile;

      }).catch( err => {
        console.log('Error pulling /profile');
        console.log(err);
      });
    });
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Perbarui foto profil',
      buttons: [
        {
          text: 'AMBIL FOTO',
          handler: () => this.getPicture('camera')
        },
      ]
    });

    await alert.present();
  }

  async getPicture(type: string){
    if ((!Capacitor.isPluginAvailable('Camera')) || (this.isDesktop && type === 'gallery')) {
      this.filePickerRef.nativeElement.click();
      return;
    }

    const image = await Camera.getPhoto({
      quality: 100,
      width: 400,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });

    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
    this.getPhoto = image.dataUrl;

  }

  onFileChoose(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    const pattern = /image-*/;
    const reader = new FileReader();

    if (!file.type.match(pattern)) {
      console.log('File format not supported');
      return;
    }

    reader.onload = () => {
      this.photo = reader.result.toString();
    };
    reader.readAsDataURL(file);

  }

  updateDetails(name, username) {
   firebase.auth().onAuthStateChanged((user) => {
     if (user) {
       // User logged in already or has just logged in.
       this.user_id = user.uid;

       if (!this.getPhoto) {
         firebase.database().ref('users/' + this.user_id ).update({
           names: name.value,
           usernames: username.value
         });
       } else if (this.getPhoto){
         firebase.database().ref('users/' + this.user_id ).update({
           photo_profile: this.getPhoto,
           names: name.value,
           usernames: username.value
         });
       }

       this.router.navigateByUrl('/home/tabs/profile');
     } else {
       // User not logged in or has just logged out.
     }
   });

  }
}


