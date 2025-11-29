
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'transferencias',   
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'transferencias',
    loadChildren: () =>
      import('./transferencias/module/transferencias.module')
        .then(m => m.TransferenciasModule)
    // canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'transferencias'    
  }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
