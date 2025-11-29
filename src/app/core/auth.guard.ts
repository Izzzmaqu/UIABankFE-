import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  canActivate(): boolean {
    //  para probar permite el acceso 
    return true;

    // cuando se implemente con todo quitar y descomentar lo de abajo
    //
    // const token = localStorage.getItem('token');
    // if (token) return true;
    // this.router.navigate(['/login']);
    // return false;
  }
}
