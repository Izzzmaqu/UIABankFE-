import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import {
  RegistrarBeneficiarioRequest,
} from '../../../core/models/beneficiario.model';
import { BeneficiariosService } from '../../../core/services/beneficiarios.service';

@Component({
  selector: 'app-beneficiarios-form',
  templateUrl: './beneficiarios-form.page.html',
  styleUrls: ['./beneficiarios-form.page.scss'],
  standalone: false
})
export class BeneficiariosFormPage implements OnInit {
  // Modelo del formulario (coincide con RegistrarBeneficiarioRequest del backend)
  modelo: RegistrarBeneficiarioRequest = {
    // TODO: reemplazar con el clienteId real (Guid) cuando tengan login integrado
    clienteId: 'REEMPLAZAR-POR-GUID-DE-PRUEBA',
    alias: '',
    banco: '',
    numeroCuenta: '',
    moneda: 1, // 1 = CRC, 2 = USD (según enum Moneda del backend)
    pais: '',
  };

  enviando = false;

  constructor(
    private beneficiariosService: BeneficiariosService,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit() {}

  async guardar() {
    if (this.enviando) {
      return;
    }

    this.enviando = true;

    this.beneficiariosService.registrar(this.modelo).subscribe({
      next: async () => {
        this.enviando = false;
        const toast = await this.toastCtrl.create({
          message: 'Beneficiario registrado correctamente',
          duration: 2000,
        });
        await toast.present();

        // Volver a la lista
        this.router.navigate(['/beneficiarios-list']);
      },
      error: async () => {
        this.enviando = false;
        const toast = await this.toastCtrl.create({
          message: 'Error al registrar beneficiario',
          duration: 3000,
        });
        await toast.present();
      },
    });
  }

  cancelar() {
    this.router.navigate(['/beneficiarios-list']);
  }
}

