
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { TransferenciaService } from '../services/transferencia.service';
import { Transferencia } from '../model/transferencia.model';

@Component({
  selector: 'app-transferencia-list',
  templateUrl: './transferencia-list.page.html',
  styleUrls: ['./transferencia-list.page.scss'],
  standalone: false
})
export class TransferenciaListPage implements OnInit {

  transferencias: Transferencia[] = [];
  cargando = false;

  constructor(
    private transferenciaService: TransferenciaService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.cargarTransferencias();
  }

  cargarTransferencias() {
    this.cargando = true;

    const usuarioId = 1; // por ahora hardcode luego deberia venir del JWT

    this.transferenciaService.listarPorUsuario(usuarioId).subscribe({
      next: (data) => {
        this.transferencias = data ?? [];
        this.cargando = false;
      },
      error: async (err) => {
        console.error('Error al listar transferencias', err);
        this.cargando = false;

        const toast = await this.toastCtrl.create({
          message: 'No se pudieron cargar las transferencias',
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }

  // Estados : colores
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

  //  Estados
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

  esProgramada(t: Transferencia): boolean {
    return (t.estado ?? '').toLowerCase() === 'programada';
  }

  // RF-D3: cancelar hasta 24h antes
  esCancelable(t: Transferencia): boolean {
    if (!this.esProgramada(t) || !t.fechaProgramada) {
      return false;
    }

    const ahora = new Date();
    const fechaProg = new Date(t.fechaProgramada);

    const diffMs = fechaProg.getTime() - ahora.getTime();
    const diffHoras = diffMs / (1000 * 60 * 60);

    return diffHoras >= 24;
  }

  async onCancelarProgramada(t: Transferencia) {
    if (!t.id) {
      return;
    }

    try {
      await this.transferenciaService.cancelarProgramada(t.id).toPromise();

      // Actualizar en memoria
      t.estado = 'Cancelada';

      const toast = await this.toastCtrl.create({
        message: 'Transferencia programada cancelada',
        duration: 2000,
        color: 'success'
      });
      await toast.present();
    } catch (err) {
      console.error('Error al cancelar la transferencia programada', err);

      const toast = await this.toastCtrl.create({
        message: 'No se pudo cancelar la transferencia programada',
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
    }
  }
}
