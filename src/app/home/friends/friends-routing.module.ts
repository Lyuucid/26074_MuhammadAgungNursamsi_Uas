import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FriendsPage } from './friends.page';

const routes: Routes = [
  {
    path: '',
    component: FriendsPage
  },
  {
    path: 'addfriend',
    loadChildren: () => import('./addfriend/addfriend.module').then( m => m.AddfriendPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FriendsPageRoutingModule {}
