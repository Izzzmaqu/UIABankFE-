import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BeneficiariosFormPage } from './beneficiarios-form.page';

const routes: Routes = [
  {
    path: '',
    component: BeneficiariosFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BeneficiariosFormPageRoutingModule {}
