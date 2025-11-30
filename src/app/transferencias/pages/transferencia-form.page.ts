
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransferenciaService } from '../services/transferencia.service';
import { NavController, ToastController } from '@ionic/angular';
import { Transferencia } from '../model/transferencia.model';

@Component({
  selector: 'app-transferencia-form',
  templateUrl: './transferencia-form.page.html',
  styleUrls: ['./transferencia-form.page.scss'],
  standalone: false
})
export class TransferenciaFormPage implements OnInit {
  form!: FormGroup;
  submitAttempted = false;
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private transferenciaService: TransferenciaService,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      cuentaOrigen: ['', Validators.required],
      cuentaDestino: ['', Validators.required],
      monto: [null, [Validators.required, Validators.min(1)]],
      moneda: ['CRC', Validators.required]
      // Si quieres re-agregar fechaProgramada opcional, la pones aquí
      // fechaProgramada: ['']
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid &&
      (control.dirty || control.touched || this.submitAttempted);
  }

  async onSubmit() {
    this.submitAttempted = true;

    if (this.form.invalid || this.cargando) {
      return;
    }

    this.cargando = true;

    // 👇 Generar Idempotency-Key
    const idempotencyKey =
      (crypto as any)?.randomUUID?.() ??
      `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

    const payload: Transferencia = {
      ...this.form.value,
      idempotencyKey
    };

    this.transferenciaService.crear(payload, idempotencyKey).subscribe({
      next: async () => {
        this.cargando = false;

        const toast = await this.toastCtrl.create({
          message: 'Transferencia creada correctamente',
          duration: 2000,
          color: 'success'
        });
        await toast.present();

        this.navCtrl.navigateBack('/transferencias');
      },
      error: async (err) => {
        console.error('Error al crear la transferencia', err);
        this.cargando = false;

        const backendMsg =
          (err?.error && typeof err.error === 'string')
            ? err.error
            : 'Ocurrió un error al crear la transferencia';

        const toast = await this.toastCtrl.create({
          message: backendMsg,
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }

  volver() {
    this.navCtrl.navigateBack('/transferencias');
  }
}
