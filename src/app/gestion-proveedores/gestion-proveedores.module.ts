import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GestionProveedoresPageRoutingModule } from './gestion-proveedores-routing.module';
import { GestionProveedoresPage } from './gestion-proveedores.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionProveedoresPageRoutingModule
  ],
  declarations: [GestionProveedoresPage]
})
export class GestionProveedoresPageModule {}
