import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'cuentas-list',
    loadChildren: () => import('./features/cuentas/cuentas-list/cuentas-list.module').then( m => m.CuentasListPageModule)
  },
  {
    path: 'beneficiarios-list',
    loadChildren: () => import('./features/beneficiarios/beneficiarios-list/beneficiarios-list.module').then( m => m.BeneficiariosListPageModule)
  },
  {
    path: 'beneficiarios-form',
    loadChildren: () => import('./features/beneficiarios/beneficiarios-form/beneficiarios-form.module').then( m => m.BeneficiariosFormPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
