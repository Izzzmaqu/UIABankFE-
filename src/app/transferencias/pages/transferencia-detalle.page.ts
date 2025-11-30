import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';

import { TransferenciaService } from '../services/transferencia.service';
import { Transferencia } from '../model/transferencia.model';

@Component({
  selector: 'app-transferencia-detalle',
  templateUrl: './transferencia-detalle.page.html',
  styleUrls: ['./transferencia-detalle.page.scss'],
  standalone: false
})
export class TransferenciaDetallePage implements OnInit {

  transferencia?: Transferencia;
  cargando = false;
  ejecutando = false;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private transferenciaService: TransferenciaService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    if (id) {
      this.cargarTransferencia(id);
    } else {
      this.mostrarToast('Identificador de transferencia inválido', 'danger');
      this.navCtrl.navigateBack('/transferencias');
    }
  }

  cargarTransferencia(id: number): void {
    this.cargando = true;

    this.transferenciaService.obtenerPorId(id).subscribe({
      next: (t) => {
        this.transferencia = t;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener la transferencia', err);
        this.cargando = false;
        this.mostrarToast(
          'No se pudo cargar el detalle de la transferencia',
          'danger'
        );
        this.navCtrl.navigateBack('/transferencias');
      }
    });
  }

  getEstadoColor(estado?: string | null): string {
    if (!estado) {
      return 'medium';
    }

    switch (estado.toLowerCase()) {
      case 'pendienteaprobacion':
      case 'pendiente':
        return 'warning';
      case 'programada':
        return 'tertiary';
      case 'exitosa':
      case 'completada':
        return 'success';
      case 'fallida':
      case 'rechazada':
      case 'cancelada':
        return 'danger';
      default:
        return 'medium';
    }
  }

  getEstadoTexto(estado?: string | null): string {
    if (!estado) {
      return 'Pendiente';
    }

    switch (estado.toLowerCase()) {
      case 'pendienteaprobacion':
        return 'Pendiente de aprobación';
      case 'pendiente':
        return 'Pendiente';
      case 'programada':
        return 'Programada';
      case 'exitosa':
      case 'completada':
        return 'Exitosa';
      case 'fallida':
        return 'Fallida';
      case 'cancelada':
        return 'Cancelada';
      case 'rechazada':
        return 'Rechazada';
      default:
        return estado;
    }
  }

  /**
   * RF-D2: solo debe poder ejecutarse cuando el estado
   * está en "PendienteAprobacion" o "Pendiente".
   */
  puedeEjecutar(): boolean {
    if (!this.transferencia || !this.transferencia.estado) {
      return false;
    }

    const estado = this.transferencia.estado.toLowerCase();

    return estado === 'pendienteaprobacion' || estado === 'pendiente';
  }

  async onEjecutar(): Promise<void> {
    if (!this.transferencia || this.ejecutando) {
      return;
    }

    this.ejecutando = true;

    // Idempotency-Key para la ejecución
    const idempotencyKey =
      (crypto as any)?.randomUUID?.() ??
      `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

    this.transferencia.idempotencyKey = idempotencyKey;

    this.transferenciaService.ejecutar(this.transferencia, idempotencyKey).subscribe({
      next: async (resp) => {
        this.ejecutando = false;

        // Si el backend devuelve el nuevo estado
        this.transferencia!.estado = 'Exitosa';

        await this.mostrarToast(
          'Transferencia ejecutada correctamente',
          'success'
        );

      
        this.navCtrl.navigateBack('/transferencias');
      },
      error: async (err) => {
        console.error('Error al ejecutar la transferencia', err);
        this.ejecutando = false;

        const backendMsg =
          (err?.error && typeof err.error === 'string')
            ? err.error
            : 'No se pudo ejecutar la transferencia';

        await this.mostrarToast(backendMsg, 'danger');
      }
    });
  }

  volver(): void {
    this.navCtrl.navigateBack('/transferencias');
  }

  private async mostrarToast(message: string, color: 'success' | 'danger' | 'warning' | 'medium') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color
    });
    await toast.present();
  }
}
