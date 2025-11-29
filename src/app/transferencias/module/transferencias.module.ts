import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TransferenciasRoutingModule } from './transferencias-routing.module';

import { TransferenciaListPage } from '../pages/transferencia-list.page';
import { TransferenciaFormPage } from '../pages/transferencia-form.page';
import { TransferenciaProgramadaFormPage } from '../pages/transferencia-programada-form.page';
import { TransferenciaDetallePage } from '../pages/transferencia-detalle.page';
import { TransferenciaProgramadaListPage } from '../pages/transferencia-programada-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TransferenciasRoutingModule
  ],
  declarations: [
    TransferenciaListPage,
    TransferenciaFormPage,
    TransferenciaProgramadaFormPage,
    TransferenciaProgramadaListPage,
    TransferenciaDetallePage
  ]
})
export class TransferenciasModule {}
