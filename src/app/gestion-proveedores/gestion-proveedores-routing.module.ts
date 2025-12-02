import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionProveedoresPage } from './gestion-proveedores.page';

const routes: Routes = [
  {
    path: '',
    component: GestionProveedoresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionProveedoresPageRoutingModule {}
