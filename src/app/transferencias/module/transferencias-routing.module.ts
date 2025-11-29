import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TransferenciaListPage } from '../pages/transferencia-list.page';
import { TransferenciaFormPage } from '../pages/transferencia-form.page';
import { TransferenciaProgramadaFormPage } from '../pages/transferencia-programada-form.page';
import { TransferenciaDetallePage } from '../pages/transferencia-detalle.page';
import { TransferenciaProgramadaListPage } from '../pages/transferencia-programada-list.page';

const routes: Routes = [
  { path: '', component: TransferenciaListPage },
  { path: 'nueva', component: TransferenciaFormPage },
  { path: 'programar', component: TransferenciaProgramadaFormPage },
  { path: 'programadas', component: TransferenciaProgramadaListPage },
  { path: ':id', component: TransferenciaDetallePage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferenciasRoutingModule {}
