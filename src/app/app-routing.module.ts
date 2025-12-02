import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth-guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // --- Auth ---
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },

  // --- Tu módulo (Login / Clientes) ---
  {
    path: 'registro-usuario',
    loadChildren: () => import('./registro-usuario/registro-usuario.module').then(m => m.RegistroUsuarioPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'lista-clientes',
    loadChildren: () => import('./lista-clientes/lista-clientes.module').then(m => m.ListaClientesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'detalle-cliente',
    loadChildren: () => import('./detalle-cliente/detalle-cliente.module').then(m => m.DetalleClientePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'detalle-cliente/:id',
    loadChildren: () => import('./detalle-cliente/detalle-cliente.module').then(m => m.DetalleClientePageModule),
    canActivate: [AuthGuard]
  },

  // --- Módulo E: Pagos de Servicios ---
  {
    path: 'gestion-proveedores',
    loadChildren: () => import('./gestion-proveedores/gestion-proveedores.module').then(m => m.GestionProveedoresPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'realizar-pago',
    loadChildren: () => import('./realizar-pago/realizar-pago.module').then(m => m.RealizarPagoPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'pagos-programados',
    loadChildren: () => import('./pagos-programados/pagos-programados.module').then(m => m.PagosProgramadosPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'historial-pagos',
    loadChildren: () => import('./historial-pagos/historial-pagos.module').then(m => m.HistorialPagosPageModule),
    canActivate: [AuthGuard]
  },

  // --- Rutas que ya estaban (Transferencias / etc.) ---
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'transferencias',
    loadChildren: () => import('./transferencias/module/transferencias.module').then(m => m.TransferenciasModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'cuentas-list',
    loadChildren: () => import('./features/cuentas/cuentas-list/cuentas-list.module').then(m => m.CuentasListPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'beneficiarios-list',
    loadChildren: () => import('./features/beneficiarios/beneficiarios-list/beneficiarios-list.module').then(m => m.BeneficiariosListPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'beneficiarios-form',
    loadChildren: () => import('./features/beneficiarios/beneficiarios-form/beneficiarios-form.module').then(m => m.BeneficiariosFormPageModule),
    canActivate: [AuthGuard]
  },

  // Siempre al final
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
