import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PagosServiciosService, PagoServicio } from '../services/pagos-servicios';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-historial-pagos',
  templateUrl: './historial-pagos.page.html',
  styleUrls: ['./historial-pagos.page.scss'],
  standalone: false,
})
export class HistorialPagosPage implements OnInit {
  pagos: PagoServicio[] = [];
  pagosFiltrados: PagoServicio[] = [];
  searchTerm: string = '';

  constructor(
    private pagosServiciosService: PagosServiciosService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.cargarHistorial();
  }

  ionViewWillEnter() {
    this.cargarHistorial();
  }

  async cargarHistorial() {
    const loading = await this.loadingController.create({
      message: 'Cargando historial...',
    });
    await loading.present();

    this.pagosServiciosService.obtenerPagos().subscribe({
      next: (data) => {
        this.pagos = data;
        this.pagosFiltrados = data;
        loading.dismiss();
      },
      error: async (error) => {
        await loading.dismiss();
        await this.mostrarAlerta('Error', 'No se pudo cargar el historial de pagos');
      }
    });
  }

  filtrarPagos() {
    const term = this.searchTerm.toLowerCase();
    this.pagosFiltrados = this.pagos.filter(pago =>
      pago.numeroContrato.toLowerCase().includes(term) ||
      pago.numeroReferencia?.toLowerCase().includes(term) ||
      pago.monto.toString().includes(term)
    );
  }

  async descargarComprobante(pago: PagoServicio) {
    if (!pago.id) {
      await this.mostrarAlerta('Error', 'No se puede descargar el comprobante');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Descargando comprobante...',
    });
    await loading.present();

    this.pagosServiciosService.descargarComprobante(pago.id).subscribe({
      next: (blob) => {
        loading.dismiss();
        
        // Crear enlace de descarga
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Comprobante_${pago.numeroReferencia || pago.id}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        
        this.mostrarAlerta('Éxito', 'Comprobante descargado');
      },
      error: async (error) => {
        await loading.dismiss();
        await this.mostrarAlerta('Error', 'No se pudo descargar el comprobante');
      }
    });
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

  getEstadoColor(estado: string | undefined): string {
    switch (estado?.toLowerCase()) {
      case 'completado':
      case 'exitoso':
        return 'success';
      case 'pendiente':
      case 'programado':
        return 'warning';
      case 'cancelado':
      case 'fallido':
        return 'danger';
      default:
        return 'medium';
    }
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
