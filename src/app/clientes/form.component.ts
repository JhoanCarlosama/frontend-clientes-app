import { Component, OnInit } from '@angular/core';
import {Cliente} from "./cliente";
import {ClienteService} from "./cliente.service";
import {Router, ActivatedRoute} from "@angular/router";
import swal from 'sweetalert2';
import {Region} from "./region";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  public cliente: Cliente = new Cliente();
  regiones: Region[];
  public titulo: string = 'Crear cliente';
  public errores: string[];

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.cargarCliente();
  }

  cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if(id) {
        this.clienteService.getCliente(id).subscribe((cliente: Cliente) => {
          this.cliente = cliente;
        });
      }
    });

    this.clienteService.getRegiones().subscribe(regiones => {
      this.regiones = regiones;
    });
  }

  create(): void {
    this.clienteService.create(this.cliente).subscribe(cliente => {
      this.router.navigate(['/clientes']);

      swal.fire('nuevo cliente', `El cliente ${cliente.nombre} ha sido creado con éxito`,  'success');
    }, err => {
      this.errores = err.error.errors as string[];
      console.log('codigo del error desde el backend: ' + err.status);
      console.log(err.error.errors);
    });
  }

  update(): void {
    this.cliente.facturas = null;

    this.clienteService.update(this.cliente).subscribe(json => {
      this.router.navigate(['/clientes']);

      swal.fire('Cliente actualizado', `${json.mensaje}: ${json.cliente.nombre}`, 'success');
    }, err => {
      this.errores = err.error.errors as string[];
      console.log('codigo del error desde el backend: ' + err.status);
      console.log(err.error.errors);
    });
  }

  compararRegion(regionFor: Region, regionCliente: Region): boolean {
    if(regionFor === undefined && regionCliente === undefined) {
      return true;
    }

    return regionFor === null || regionCliente === null || regionFor === undefined || regionCliente === undefined ? false: regionFor.id === regionCliente.id;
  }
}
