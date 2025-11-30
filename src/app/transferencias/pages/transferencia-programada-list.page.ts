import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { TransferenciaService } from '../services/transferencia.service';
import { Transferencia } from '../model/transferencia.model';

@Component({
  selector: 'app-transferencia-programada-list',
  templateUrl: '../pages/transferencia-programada-list.page.html',
  standalone: false
})
export class TransferenciaProgramadaListPage implements OnInit {

  transferenciasProgramadas: Transferencia[] = [];
  cargando = false;

  constructor(
    private transferenciaService: TransferenciaService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit(): void {
    this.cargarProgramadas();
  }

  cargarProgramadas(): void {
    this.cargando = true;

    const usuarioId = 1; 

    this.transferenciaService.listarProgramadasPorUsuario(usuarioId).subscribe({
      next: (data) => {
        this.transferenciasProgramadas = data ?? [];
        this.cargando = false;
      },
      error: async (err) => {
        console.error('Error al listar programadas', err);
        this.cargando = false;

        const toast = await this.toastCtrl.create({
          message: 'No se pudieron cargar las transferencias programadas',
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }

  getEstadoColor(estado?: string | null): string {
    if (!estado) return 'medium';

    switch (estado.toLowerCase()) {
      case 'programada':
        return 'tertiary';
      case 'cancelada':
        return 'danger';
      case 'exitosa':
      case 'completada':
        return 'success';
      default:
        return 'medium';
    }
  }

  getEstadoTexto(estado?: string | null): string {
    if (!estado) return 'Programada';

    switch (estado.toLowerCase()) {
      case 'programada':
        return 'Programada';
      case 'cancelada':
        return 'Cancelada';
      case 'exitosa':
      case 'completada':
        return 'Ejecutada';
      default:
        return estado;
    }
  }

  // RF-D3: cancelar hasta 24h antes
  esCancelable(t: Transferencia): boolean {
    if ((t.estado ?? '').toLowerCase() !== 'programada' || !t.fechaProgramada) {
      return false;
    }

    const ahora = new Date();
    const fechaProg = new Date(t.fechaProgramada);

    const diffMs = fechaProg.getTime() - ahora.getTime();
    const diffHoras = diffMs / (1000 * 60 * 60);

    return diffHoras >= 24;
  }

  async onCancelarProgramada(t: Transferencia) {
    if (!t.id) return;

    try {
      await this.transferenciaService.cancelarProgramada(t.id).toPromise();

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
