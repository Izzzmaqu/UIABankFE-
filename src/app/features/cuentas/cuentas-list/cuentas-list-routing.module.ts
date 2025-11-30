import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CuentasListPage } from './cuentas-list.page';

const routes: Routes = [
  {
    path: '',
    component: CuentasListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CuentasListPageRoutingModule {}
