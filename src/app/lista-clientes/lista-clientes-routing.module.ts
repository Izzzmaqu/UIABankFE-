import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaClientesPage } from './lista-clientes.page';

const routes: Routes = [
  {
    path: '',
    component: ListaClientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaClientesPageRoutingModule {}
