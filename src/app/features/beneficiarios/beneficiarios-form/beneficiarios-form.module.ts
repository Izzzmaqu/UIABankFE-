import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BeneficiariosFormPageRoutingModule } from './beneficiarios-form-routing.module';

import { BeneficiariosFormPage } from './beneficiarios-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BeneficiariosFormPageRoutingModule
  ],
  declarations: [BeneficiariosFormPage]
})
export class BeneficiariosFormPageModule {}
