import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PagosServiciosService, RealizarPagoRequest } from '../services/pagos-servicios';
import { ProveedoresService, Proveedor } from '../services/proveedores';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-realizar-pago',
  templateUrl: './realizar-pago.page.html',
  styleUrls: ['./realizar-pago.page.scss'],
  standalone: false,
})
export class RealizarPagoPage implements OnInit {
  proveedores: Proveedor[] = [];
  
  pago: RealizarPagoRequest = {
    proveedorId: 0,
    numeroContrato: '',
    monto: 0,
    cuentaOrigenId: 0,
    fechaProgramada: null
  };

  proveedorSeleccionado?: Proveedor;
  esPagoProgramado: boolean = false;
  fechaMinima: string = '';
  fechaMaxima: string = '';

  constructor(
    private pagosServiciosService: PagosServiciosService,
    private proveedoresService: ProveedoresService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    this.configurarFechas();
  }

  ngOnInit() {
    this.cargarProveedores();
  }

  configurarFechas() {
    const hoy = new Date();
    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1);
    
    const maxFecha = new Date(hoy);
    maxFecha.setMonth(maxFecha.getMonth() + 6);

    this.fechaMinima = mañana.toISOString();
    this.fechaMaxima = maxFecha.toISOString();
  }

  cargarProveedores() {
    this.proveedoresService.obtenerProveedores().subscribe({
      next: (data) => {
        this.proveedores = data.filter(p => p.activo);
      },
      error: (error) => {
        console.error('Error al cargar proveedores', error);
      }
    });
  }

  onProveedorChange() {
    this.proveedorSeleccionado = this.proveedores.find(
      p => p.id === this.pago.proveedorId
    );
    this.pago.numeroContrato = '';
  }

  validarContrato(): boolean {
    if (!this.proveedorSeleccionado || !this.pago.numeroContrato) {
      return false;
    }

    const longitud = this.pago.numeroContrato.length;
    return longitud >= this.proveedorSeleccionado.longitudMinima &&
           longitud <= this.proveedorSeleccionado.longitudMaxima;
  }

  async realizarPago() {
    if (!this.validarFormulario()) {
      await this.mostrarAlerta('Error', 'Complete todos los campos correctamente');
      return;
    }

    if (!this.validarContrato()) {
      await this.mostrarAlerta(
        'Error', 
        `El número de contrato debe tener entre ${this.proveedorSeleccionado?.longitudMinima} y ${this.proveedorSeleccionado?.longitudMaxima} dígitos`
      );
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Procesando pago...',
    });
    await loading.present();

    const pagoData = { ...this.pago };
    if (!this.esPagoProgramado) {
      pagoData.fechaProgramada = null;
    }

    this.pagosServiciosService.realizarPago(pagoData).subscribe({
      next: async (response) => {
        await loading.dismiss();
        await this.mostrarAlerta(
          'Éxito', 
          this.esPagoProgramado 
            ? 'Pago programado exitosamente' 
            : `Pago realizado. Referencia: ${response.numeroReferencia || 'N/A'}`
        );
        this.limpiarFormulario();
      },
      error: async (error) => {
        await loading.dismiss();
        const mensaje = error.error?.mensaje || error.error || 'Error al procesar el pago';
        await this.mostrarAlerta('Error', mensaje);
      }
    });
  }

  validarFormulario(): boolean {
    return !!(
      this.pago.proveedorId > 0 &&
      this.pago.numeroContrato &&
      this.pago.monto > 0 &&
      this.pago.cuentaOrigenId > 0 &&
      (!this.esPagoProgramado || this.pago.fechaProgramada)
    );
  }

  limpiarFormulario() {
    this.pago = {
      proveedorId: 0,
      numeroContrato: '',
      monto: 0,
      cuentaOrigenId: 0,
      fechaProgramada: null
    };
    this.proveedorSeleccionado = undefined;
    this.esPagoProgramado = false;
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  volver() {
    this.router.navigate(['/lista-clientes']);
  }
}
