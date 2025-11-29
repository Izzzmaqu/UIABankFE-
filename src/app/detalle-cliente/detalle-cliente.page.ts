import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientesService, Cliente } from '../services/clientes';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-detalle-cliente',
  templateUrl: './detalle-cliente.page.html',
  styleUrls: ['./detalle-cliente.page.scss'],
  standalone: false,  // ← ELIMINAR ESTA LÍNEA

})
export class DetalleClientePage implements OnInit {
  cliente: Cliente = {
    identificacion: '',
    nombreCompleto: '',
    telefono: '',
    correo: ''
  };
  
  esEdicion: boolean = false;
  clienteId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientesService: ClientesService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.clienteId = parseInt(id);
      this.esEdicion = true;
      this.cargarCliente(this.clienteId);
    }
  }

  async cargarCliente(id: number) {
    const loading = await this.loadingController.create({
      message: 'Cargando cliente...',
    });
    await loading.present();

    this.clientesService.obtenerClientePorId(id).subscribe({
      next: (data) => {
        this.cliente = data;
        loading.dismiss();
      },
      error: async (error) => {
        await loading.dismiss();
        await this.mostrarAlerta('Error', 'No se pudo cargar el cliente');
        this.router.navigate(['/lista-clientes']);
      }
    });
  }

  async guardar() {
    if (!this.validarFormulario()) {
      await this.mostrarAlerta('Error', 'Complete todos los campos obligatorios');
      return;
    }

    const loading = await this.loadingController.create({
      message: this.esEdicion ? 'Actualizando cliente...' : 'Creando cliente...',
    });
    await loading.present();

    if (this.esEdicion && this.clienteId) {
      // Actualizar cliente existente
      this.clientesService.actualizarCliente(this.clienteId, this.cliente).subscribe({
        next: async (response) => {
          await loading.dismiss();
          await this.mostrarAlerta('Éxito', 'Cliente actualizado correctamente');
          this.router.navigate(['/lista-clientes']);
        },
        error: async (error) => {
          await loading.dismiss();
          const mensaje = error.error?.mensaje || 'Error al actualizar el cliente';
          await this.mostrarAlerta('Error', mensaje);
        }
      });
    } else {
      // Crear nuevo cliente
      this.clientesService.crearCliente(this.cliente).subscribe({
        next: async (response) => {
          await loading.dismiss();
          await this.mostrarAlerta('Éxito', 'Cliente creado correctamente');
          this.router.navigate(['/lista-clientes']);
        },
        error: async (error) => {
          await loading.dismiss();
          const mensaje = error.error?.mensaje || 'Error al crear el cliente';
          await this.mostrarAlerta('Error', mensaje);
        }
      });
    }
  }

  validarFormulario(): boolean {
    return !!(
      this.cliente.identificacion &&
      this.cliente.nombreCompleto &&
      this.cliente.telefono &&
      this.cliente.correo
    );
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  cancelar() {
    this.router.navigate(['/lista-clientes']);
  }
}
