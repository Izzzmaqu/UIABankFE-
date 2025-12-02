import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionProveedoresPage } from './gestion-proveedores.page';

describe('GestionProveedoresPage', () => {
  let component: GestionProveedoresPage;
  let fixture: ComponentFixture<GestionProveedoresPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionProveedoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
