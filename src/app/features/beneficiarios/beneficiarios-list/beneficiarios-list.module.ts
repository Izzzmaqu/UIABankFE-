import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BeneficiariosListPageRoutingModule } from './beneficiarios-list-routing.module';

import { BeneficiariosListPage } from './beneficiarios-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BeneficiariosListPageRoutingModule
  ],
  declarations: [BeneficiariosListPage]
})
export class BeneficiariosListPageModule {}
