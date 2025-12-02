import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
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
      await this.mostrarAlerta('Error', 'Complete todos los campos');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
    });
    await loading.present();

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: async (response) => {
        await loading.dismiss();
        
        if (response.token) {
          // Login exitoso
          this.router.navigate(['/lista-clientes']); // ← Redirigir aquí
        } else {
          await this.mostrarAlerta('Error', 'No se recibió token');
        }
      },
      error: async (error) => {
        await loading.dismiss();
        const mensaje = error.error?.mensaje || 'Credenciales incorrectas';
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
