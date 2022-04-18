import {Component, Input, OnInit} from '@angular/core';
import {Cliente} from "../cliente";
import {ClienteService} from "../cliente.service";
//import {ActivatedRoute} from "@angular/router";
import swal from "sweetalert2";
import {HttpEventType} from "@angular/common/http";
import {ModalService} from "./modal.service";
import {AuthService} from "../../usuarios/auth.service";
import {FacturaService} from "../../facturas/services/factura.service";
import {Factura} from "../../facturas/models/factura";

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  //cliente: Cliente;
  @Input() cliente: Cliente;
  titulo: string = "Detalle del cliente";
  fotoSeleccionada: File;
  progreso: number = 0;

  constructor(
    private clienteService: ClienteService,
    private facturaService: FacturaService,
    public modalService: ModalService,
    public authService: AuthService
    //private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    if(this.cliente) {
      console.log('cliente: ', this.cliente.facturas.length == 0)
      console.log('cliente2: ', this.cliente.facturas.length > 0)
    }
    /*this.activatedRoute.paramMap.subscribe(params => {
      let id:number = +params.get('id');

      if(id) {
        this.clienteService.getCliente(id).subscribe(cliente => {
          this.cliente = cliente;
        });
      }
    });*/
  }

  seleccionarFoto(e) {
    this.fotoSeleccionada = e.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada)
    if(this.fotoSeleccionada.type.indexOf('image') < 0) {
      swal.fire('Error seleccionar imagen: ', 'El archivo deber del tipo imagen', 'error');
      this.fotoSeleccionada = null;
    }
  }

  /*subirFoto() {
    if(!this.fotoSeleccionada) {
      swal.fire('Error Upload:', 'Debe seleccionar una foto', 'error');
    } else {
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).subscribe(cliente => {
          this.cliente = cliente;
          swal.fire(
            'La foto se ha subido completamente!',
            `La foto se ha subido con exito: ${this.cliente.foto}`,
            'success'
          );
      });
    }
  }*/

  subirFoto() {
    if(!this.fotoSeleccionada) {
      swal.fire('Error Upload:', 'Debe seleccionar una foto', 'error');
    } else {
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).subscribe(event => {
          if(event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded/event.total) * 100);
          } else if(event.type === HttpEventType.Response) {
            let response: any = event.body;
            this.cliente = response.cliente as Cliente;

            this.modalService.notificarUpload.emit(this.cliente);

            swal.fire(
            'La foto se ha subido completamente!',
            response.mensaje,
            'success'
            );
          }
      });
    }
  }

  cerrarModal() {
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

  delete(factura: Factura): void {
    swal.fire({
      title: 'Estás seguro?',
      text: `¿Seguro que desea eliminar la factura ${factura.descripcion}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.facturaService.delete(factura.id).subscribe(response => {
          this.cliente.facturas = this.cliente.facturas.filter(f => f !== factura);

          swal.fire(
            'Factura Eliminada!',
            `Factura ${factura.descripcion} eliminada con éxito.`,
            'success'
          )
        });
      }
    });
  }
}
