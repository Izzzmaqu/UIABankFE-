import { Moneda } from './enums-cuenta.model';
import { EstadoBeneficiario } from './enums-beneficiario.model';

export interface BeneficiarioDto {
  id: string;
  clienteId: string;
  alias: string;
  banco: string;
  moneda: Moneda;
  numeroCuenta: string;
  pais: string;
  estado: EstadoBeneficiario;
}

export interface RegistrarBeneficiarioRequest {
  clienteId: string;
  alias: string;
  banco: string;
  moneda: Moneda;
  numeroCuenta: string;
  pais: string;
}

export interface BeneficiariosFiltro {
  clienteId: string;
  alias?: string;
  banco?: string;
  pais?: string;
}