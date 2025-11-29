import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,  // ← ELIMINAR ESTA LÍNEA

})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  async onLogin() {
    if (!this.email || !this.password) {
      await this.mostrarAlerta('Error', 'Por favor ingrese email y contraseña');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
    });
    await loading.present();

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: async (response) => {
        await loading.dismiss();
        if (response.exitoso && response.token) {
          // Login exitoso
          await this.mostrarAlerta('Éxito', response.mensaje);
          this.router.navigate(['/lista-clientes']);
        } else {
          await this.mostrarAlerta('Error', response.mensaje);
        }
      },
      error: async (error) => {
        await loading.dismiss();
        const mensaje = error.error?.mensaje || 'Error al iniciar sesión';
        await this.mostrarAlerta('Error', mensaje);
      }
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
}
