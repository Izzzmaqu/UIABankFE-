import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { TransferenciaService } from '../services/transferencia.service';
import { Transferencia } from '../model/transferencia.model';

//  fecha >= hoy y <= hoy + maxDays
export function fechaProgramadaRangoValidator(maxDays: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const seleccionada = new Date(value);
    if (isNaN(seleccionada.getTime())) return null;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const max = new Date(hoy);
    max.setDate(max.getDate() + maxDays);

    if (seleccionada < hoy) {
      return { fechaPasada: true };
    }

    if (seleccionada > max) {
      return { maxDias: maxDays };
    }

    return null;
  };
}

@Component({
  selector: 'app-transferencia-programada-form',
  templateUrl: './transferencia-programada-form.page.html',
  styleUrls: ['./transferencia-programada-form.page.scss'],
  standalone: false
})
export class TransferenciaProgramadaFormPage implements OnInit {

  form!: FormGroup;
  submitAttempted = false;
  cargando = false;

  mostrarFecha = false;
  minFechaProgramada!: string;
  maxFechaProgramada!: string;

  constructor(
    private fb: FormBuilder,
    private transferenciaService: TransferenciaService,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit(): void {
    const hoy = new Date();
    const max = new Date();
    max.setDate(max.getDate() + 90); // RF-D3: 90 días

    this.minFechaProgramada = hoy.toISOString();
    this.maxFechaProgramada = max.toISOString();

    this.form = this.fb.group({
      cuentaOrigen: ['', Validators.required],
      cuentaDestino: ['', Validators.required],
      monto: [null, [Validators.required, Validators.min(1)]],
      moneda: ['CRC', Validators.required],
      fechaProgramada: [
        '',
        [
          Validators.required,
          fechaProgramadaRangoValidator(90)
        ]
      ]
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control &&
      control.invalid &&
      (control.dirty || control.touched || this.submitAttempted);
  }

  toggleFecha() {
    this.mostrarFecha = !this.mostrarFecha;
  }

  onFechaChange(event: any) {
    const value = event.detail.value;
    this.form.get('fechaProgramada')?.setValue(value);
    this.mostrarFecha = false;
  }

  async onSubmit() {
    this.submitAttempted = true;

    if (this.form.invalid || this.cargando) {
      return;
    }

    this.cargando = true;

    const payload: Transferencia = {
      ...this.form.value
    };

    this.transferenciaService.programar(payload).subscribe({
      next: async () => {
        this.cargando = false;

        const toast = await this.toastCtrl.create({
          message: 'Transferencia programada correctamente',
          duration: 2000,
          color: 'success'
        });
        await toast.present();

        this.navCtrl.navigateBack('/transferencias');
      },
      error: async (err) => {
        console.error('Error al programar la transferencia', err);
        this.cargando = false;

        const backendMsg =
          (err?.error && typeof err.error === 'string')
            ? err.error
            : 'Ocurrió un error al programar la transferencia';

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
