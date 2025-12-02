import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientesService, Cliente } from '../services/clientes';
import { AuthService } from '../services/auth';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-lista-clientes',
  templateUrl: './lista-clientes.page.html',
  styleUrls: ['./lista-clientes.page.scss'],
  standalone: false, // ← ELIMINAR ESTA LÍNEA
})
export class ListaClientesPage implements OnInit {
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  searchTerm: string = '';

  constructor(
    private clientesService: ClientesService,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.cargarClientes();
  }

  ionViewWillEnter() {
    this.cargarClientes();
  }

  async cargarClientes() {
    const loading = await this.loadingController.create({
      message: 'Cargando clientes...',
    });
    await loading.present();

    this.clientesService.obtenerClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.clientesFiltrados = data;
        loading.dismiss();
      },
      error: async (error) => {
        await loading.dismiss();
        await this.mostrarAlerta('Error', 'No se pudieron cargar los clientes');
      },
    });
  }

  filtrarClientes() {
    const term = this.searchTerm.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(
      (cliente) =>
        cliente.nombreCompleto.toLowerCase().includes(term) ||
        cliente.identificacion.toLowerCase().includes(term) ||
        cliente.correo.toLowerCase().includes(term)
    );
  }

  verDetalle(cliente: Cliente) {
    this.router.navigate(['/detalle-cliente', cliente.id]);
  }

  nuevoCliente() {
    this.router.navigate(['/detalle-cliente']);
  }

  registrarUsuario() {
    this.router.navigate(['/registro-usuario']);
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Está seguro que desea cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Salir',
          handler: () => {
            this.authService.logout();
            this.router.navigate(['/login']);
          },
        },
      ],
    });
    await alert.present();
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
  // NUEVO: Módulo E - Pagos de Servicios
  gestionarProveedores() {
    this.router.navigate(['/gestion-proveedores']);
  }

  realizarPago() {
    this.router.navigate(['/realizar-pago']);
  }

  verPagosProgramados() {
    this.router.navigate(['/pagos-programados']);
  }

  verHistorial() {
    this.router.navigate(['/historial-pagos']);
  }
}
