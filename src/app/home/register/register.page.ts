import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {Router} from '@angular/router';
import {LoadingController, ToastController} from "@ionic/angular";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  constructor(
      public authService: AuthenticationService,
      public router: Router,
      private toastController: ToastController,
      private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
  }

  signUp(email, password, name, username){
    this.authService.RegisterUser(email.value, password.value, name.value, username.value)
        .then((res) => {
          // Do send verification email
          this.authService.SendVerificationMail();
          this.router.navigate(['/home/verify-email']);
          this.presentToast();
        }).catch((error) => {
      window.alert(error.message);
    });
  }

    async presentToast() {
        const toast = await this.toastController.create({
            message: 'Link verifikasi sukses dikirim!',
            color: 'secondary',
            duration: 4000
        });
        toast.present();
    }

    async presentLoading(email, password, name, username) {
        const loading = await this.loadingCtrl.create({
            cssClass: 'my-custom-class',
            spinner: 'dots',
            duration: 4000
        });
        await loading.present();

        await loading.onDidDismiss().then(() => {
            this.signUp(email, password, name, username);
        });
    }


}
