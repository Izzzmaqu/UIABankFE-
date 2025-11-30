import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { CuentasService } from '../../../core/services/cuentas.service';
import { CuentaDto } from '../../../core/models/cuenta.model';

@Component({
  selector: 'app-cuentas-list',
  templateUrl: './cuentas-list.page.html',
  styleUrls: ['./cuentas-list.page.scss'],
  standalone: false
})
export class CuentasListPage implements OnInit {
  cuentas: CuentaDto[] = [];
  cargando = false;
  error?: string;

  // TODO: cambiar este clienteId por el que venga de tu login
  clienteId = 'REEMPLAZAR-POR-GUID-DE-PRUEBA';

  constructor(
    private cuentasService: CuentasService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.cargar();
  }

  cargar(event?: any) {
    this.cargando = !event;
    this.cuentasService.obtenerPorCliente(this.clienteId).subscribe({
      next: (data) => {
        this.cuentas = data;
        this.cargando = false;
        event?.target?.complete();
      },
      error: async () => {
        this.cargando = false;
        this.error = 'No se pudieron cargar las cuentas';
        event?.target?.complete();
        const toast = await this.toastCtrl.create({
          message: this.error,
          duration: 3000,
        });
        await toast.present();
      },
    });
  }
}
