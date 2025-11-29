import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth-guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
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
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
