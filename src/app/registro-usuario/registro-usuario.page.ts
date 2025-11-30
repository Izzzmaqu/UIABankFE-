import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from '../services/usuarios';
import { ClientesService } from '../services/clientes';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.page.html',
  styleUrls: ['./registro-usuario.page.scss'],
  standalone: false,  

})
export class RegistroUsuarioPage {
  email: string = '';
  password: string = '';
  rol: string = 'Gestor';
  clienteId: number | null = null;
  clientes: any[] = [];

  constructor(
    private usuariosService: UsuariosService,
    private clientesService: ClientesService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ionViewWillEnter() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.clientesService.obtenerClientes().subscribe({
      next: (data) => {
        this.clientes = data;
      },
      error: (error) => {
        console.error('Error al cargar clientes', error);
      }
    });
  }

  async onRegistrar() {
    if (!this.email || !this.password || !this.rol) {
      await this.mostrarAlerta('Error', 'Complete todos los campos obligatorios');
      return;
    }

    if (this.rol === 'Cliente' && !this.clienteId) {
      await this.mostrarAlerta('Error', 'Debe seleccionar un cliente para el rol Cliente');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Registrando usuario...',
    });
    await loading.present();

    const data = {
      email: this.email,
      password: this.password,
      rol: this.rol as 'Administrador' | 'Gestor' | 'Cliente',
      clienteId: this.rol === 'Cliente' ? this.clienteId : null
    };

    this.usuariosService.registrarUsuario(data).subscribe({
      next: async (response) => {
        await loading.dismiss();
        await this.mostrarAlerta('Éxito', response.mensaje || 'Usuario registrado exitosamente');
        this.limpiarFormulario();
      },
      error: async (error) => {
        await loading.dismiss();
        const mensaje = error.error?.mensaje || error.error || 'Error al registrar usuario';
        await this.mostrarAlerta('Error', mensaje);
      }
    });
  }

  limpiarFormulario() {
    this.email = '';
    this.password = '';
    this.rol = 'Gestor';
    this.clienteId = null;
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
}
