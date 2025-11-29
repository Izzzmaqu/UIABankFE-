import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { BeneficiariosService } from '../../../core/services/beneficiarios.service';
import { BeneficiarioDto } from '../../../core/models/beneficiario.model';

@Component({
  selector: 'app-beneficiarios-list',
  templateUrl: './beneficiarios-list.page.html',
  styleUrls: ['./beneficiarios-list.page.scss'],
  standalone: false
})
export class BeneficiariosListPage implements OnInit {
  beneficiarios: BeneficiarioDto[] = [];
  aliasFiltro = '';
  bancoFiltro = '';
  paisFiltro = '';

  // TODO: cambiar por clienteId real
  clienteId = 'REEMPLAZAR-POR-GUID-DE-PRUEBA';

  constructor(
    private beneficiariosService: BeneficiariosService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.beneficiariosService
      .obtenerPorCliente({
        clienteId: this.clienteId,
        alias: this.aliasFiltro,
        banco: this.bancoFiltro,
        pais: this.paisFiltro,
      })
      .subscribe({
        next: (data) => (this.beneficiarios = data),
        error: async () => {
          const toast = await this.toastCtrl.create({
            message: 'Error al cargar beneficiarios',
            duration: 3000,
          });
          await toast.present();
        },
      });
  }

  limpiarFiltros() {
    this.aliasFiltro = '';
    this.bancoFiltro = '';
    this.paisFiltro = '';
    this.cargar();
  }

  nuevo() {
    this.router.navigate(['/beneficiarios-form']);
  }

  async confirmar(b: BeneficiarioDto) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar beneficiario',
      message: `¿Confirmar el beneficiario <strong>${b.alias}</strong>?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Confirmar',
          handler: () => {
            this.beneficiariosService
              .confirmar(b.id, this.clienteId)
              .subscribe({
                next: async () => {
                  const toast = await this.toastCtrl.create({
                    message: 'Beneficiario confirmado',
                    duration: 2000,
                  });
                  await toast.present();
                  this.cargar();
                },
              });
          },
        },
      ],
    });

    await alert.present();
  }
}
