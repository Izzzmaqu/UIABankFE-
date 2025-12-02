import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PagosServiciosService, PagoServicio } from '../services/pagos-servicios';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-pagos-programados',
  templateUrl: './pagos-programados.page.html',
  styleUrls: ['./pagos-programados.page.scss'],
  standalone: false,
})
export class PagosProgramadosPage implements OnInit {
  pagosProgramados: PagoServicio[] = [];

  constructor(
    private pagosServiciosService: PagosServiciosService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.cargarPagosProgramados();
  }

  ionViewWillEnter() {
    this.cargarPagosProgramados();
  }

  async cargarPagosProgramados() {
    const loading = await this.loadingController.create({
      message: 'Cargando pagos programados...',
    });
    await loading.present();

    this.pagosServiciosService.obtenerPagosProgramados().subscribe({
      next: (data) => {
        this.pagosProgramados = data;
        loading.dismiss();
      },
      error: async (error) => {
        await loading.dismiss();
        await this.mostrarAlerta('Error', 'No se pudieron cargar los pagos programados');
      }
    });
  }

  puedeCancelar(pago: PagoServicio): boolean {
    if (!pago.fechaProgramada) return false;
    
    const fechaPago = new Date(pago.fechaProgramada);
    const ahora = new Date();
    const diferencia = fechaPago.getTime() - ahora.getTime();
    const horasRestantes = diferencia / (1000 * 60 * 60);
    
    return horasRestantes > 24;
  }

  async cancelarPago(pago: PagoServicio) {
    if (!this.puedeCancelar(pago)) {
      await this.mostrarAlerta(
        'No permitido', 
        'Solo puede cancelar pagos con más de 24 horas de anticipación'
      );
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar Cancelación',
      message: `¿Está seguro de cancelar este pago programado de $${pago.monto}?`,
      buttons: [
        { text: 'No', role: 'cancel' },
        {
          text: 'Sí, Cancelar',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Cancelando pago...',
            });
            await loading.present();

            this.pagosServiciosService.cancelarPago(pago.id!).subscribe({
              next: async () => {
                await loading.dismiss();
                await this.mostrarAlerta('Éxito', 'Pago cancelado correctamente');
                this.cargarPagosProgramados();
              },
              error: async (error) => {
                await loading.dismiss();
                const mensaje = error.error?.mensaje || 'Error al cancelar el pago';
                await this.mostrarAlerta('Error', mensaje);
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  formatearFecha(fecha: Date | undefined): string {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  nuevoPago() {
    this.router.navigate(['/realizar-pago']);
  }
}
