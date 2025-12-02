import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagosProgramadosPage } from './pagos-programados.page';

const routes: Routes = [
  {
    path: '',
    component: PagosProgramadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagosProgramadosPageRoutingModule {}
