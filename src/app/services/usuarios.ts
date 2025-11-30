import { Injectable } from '@angular/core';
import { ApiHttpService } from './api-http.service';
import { Observable } from 'rxjs';

export interface RegistroUsuarioRequest {
  email: string;
  password: string;
  rol: 'Administrador' | 'Gestor' | 'Cliente';
  clienteId: number | null;
}

export interface RegistroUsuarioResponse {
  mensaje: string;
  usuarioId: number;
  email: string;
  rol: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {

  constructor(private api: ApiHttpService) {}

  registrarUsuario(data: RegistroUsuarioRequest): Observable<RegistroUsuarioResponse> {
    return this.api.post<RegistroUsuarioResponse>('api/Usuarios/registro', data);
  }
}
