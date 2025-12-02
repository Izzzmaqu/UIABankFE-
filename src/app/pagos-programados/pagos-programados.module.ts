import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PagosProgramadosPageRoutingModule } from './pagos-programados-routing.module';

import { PagosProgramadosPage } from './pagos-programados.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PagosProgramadosPageRoutingModule
  ],
  declarations: [PagosProgramadosPage]
})
export class PagosProgramadosPageModule {}
