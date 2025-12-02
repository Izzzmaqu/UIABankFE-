import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProveedoresService, Proveedor } from '../services/proveedores';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-gestion-proveedores',
  templateUrl: './gestion-proveedores.page.html',
  styleUrls: ['./gestion-proveedores.page.scss'],
  standalone: false,
})
export class GestionProveedoresPage implements OnInit {
  proveedores: Proveedor[] = [];
  mostrarFormulario: boolean = false;
  
  proveedor: Proveedor = {
    nombre: '',
    tipoServicio: '',
    formatoContrato: '',
    longitudMinima: 8,
    longitudMaxima: 12,
    activo: true
  };
  
  esEdicion: boolean = false;

  constructor(
    private proveedoresService: ProveedoresService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.cargarProveedores();
  }

  ionViewWillEnter() {
    this.cargarProveedores();
  }

  async cargarProveedores() {
    const loading = await this.loadingController.create({
      message: 'Cargando proveedores...',
    });
    await loading.present();

    this.proveedoresService.obtenerProveedores().subscribe({
      next: (data) => {
        this.proveedores = data;
        loading.dismiss();
      },
      error: async (error) => {
        await loading.dismiss();
        await this.mostrarAlerta('Error', 'No se pudieron cargar los proveedores');
      }
    });
  }

  nuevoProveedor() {
    this.esEdicion = false;
    this.proveedor = {
      nombre: '',
      tipoServicio: '',
      formatoContrato: '',
      longitudMinima: 8,
      longitudMaxima: 12,
      activo: true
    };
    this.mostrarFormulario = true;
  }

  editarProveedor(prov: Proveedor) {
    this.esEdicion = true;
    this.proveedor = { ...prov };
    this.mostrarFormulario = true;
  }

  async guardar() {
    if (!this.validarFormulario()) {
      await this.mostrarAlerta('Error', 'Complete todos los campos obligatorios');
      return;
    }

    const loading = await this.loadingController.create({
      message: this.esEdicion ? 'Actualizando...' : 'Creando...',
    });
    await loading.present();

    if (this.esEdicion && this.proveedor.id) {
      this.proveedoresService.actualizarProveedor(this.proveedor.id, this.proveedor).subscribe({
        next: async () => {
          await loading.dismiss();
          await this.mostrarAlerta('Éxito', 'Proveedor actualizado');
          this.mostrarFormulario = false;
          this.cargarProveedores();
        },
        error: async (error) => {
          await loading.dismiss();
          await this.mostrarAlerta('Error', error.error?.mensaje || 'Error al actualizar');
        }
      });
    } else {
      this.proveedoresService.crearProveedor(this.proveedor).subscribe({
        next: async () => {
          await loading.dismiss();
          await this.mostrarAlerta('Éxito', 'Proveedor creado');
          this.mostrarFormulario = false;
          this.cargarProveedores();
        },
        error: async (error) => {
          await loading.dismiss();
          await this.mostrarAlerta('Error', error.error?.mensaje || 'Error al crear');
        }
      });
    }
  }

  async eliminarProveedor(prov: Proveedor) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: `¿Está seguro de eliminar el proveedor ${prov.nombre}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Eliminando...',
            });
            await loading.present();

            this.proveedoresService.eliminarProveedor(prov.id!).subscribe({
              next: async () => {
                await loading.dismiss();
                await this.mostrarAlerta('Éxito', 'Proveedor eliminado');
                this.cargarProveedores();
              },
              error: async (error) => {
                await loading.dismiss();
                await this.mostrarAlerta('Error', 'No se pudo eliminar el proveedor');
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  cancelar() {
    this.mostrarFormulario = false;
  }

  validarFormulario(): boolean {
    return !!(
      this.proveedor.nombre &&
      this.proveedor.tipoServicio &&
      this.proveedor.formatoContrato &&
      this.proveedor.longitudMinima &&
      this.proveedor.longitudMaxima
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

  volver() {
    this.router.navigate(['/lista-clientes']);
  }
}
