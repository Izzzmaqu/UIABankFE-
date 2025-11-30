import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CuentasListPageRoutingModule } from './cuentas-list-routing.module';

import { CuentasListPage } from './cuentas-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CuentasListPageRoutingModule
  ],
  declarations: [CuentasListPage]
})
export class CuentasListPageModule {}
