import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
    {
    path: 'tabs',
    component: HomePage,
    children: [
        {
            path: 'friends',
            loadChildren: () => import('./friends/friends.module').then( m => m.FriendsPageModule)
        },

        {
            path: 'maps',
            loadChildren: () => import('./maps/maps.module').then( m => m.MapsPageModule)
        },

        {
            path: 'profile',
            loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
        },
    ]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'verify-email',
    loadChildren: () => import('./verify-email/verify-email.module').then( m => m.VerifyEmailPageModule)
  },
    {
        path: 'edit-profile',
        loadChildren: () => import('./edit-profile/edit-profile.module').then(m => m.EditProfilePageModule)
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }
