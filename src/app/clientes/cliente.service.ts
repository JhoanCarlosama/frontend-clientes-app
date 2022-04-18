import { Injectable } from '@angular/core';
import {Cliente} from "./cliente";
import {Observable, of, throwError} from "rxjs";
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from "@angular/common/http";
import {map, catchError, tap} from 'rxjs/operators';
import swal from "sweetalert2";
import {Router} from '@angular/router';
import {Region} from "./region";
import { URL_BACKEND } from "../config/config";
// import {AuthService} from "../usuarios/auth.service";

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndPoint: string =  URL_BACKEND + '/api';
  // ruta del curso, en mi caso lo uso sin /clientes
  // private urlEndPoint: string =  URL_BACKEND + '/api/clientes';
  // la siguiente linea ya no crea el headers porque se inyecta mediante el interceptor(TokenInterceptor)
  // private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(
    private http: HttpClient,
    private router: Router,
    // private authService: AuthService
  ) { }

  /*private agregarAuthorizationHeader() {
    let token = this.authService.token;

    if(token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }*/

 /* private isNoAutorizado(e): boolean {
    if(e.status == 401) {
      if(this.authService.isAuthenticated()) {
        this.authService.logout();
      }

      this.router.navigate(['/login']);
      return true;
    }
    if(e.status == 403) {
      swal.fire('Acceso denegado', `Hola ${ this.authService.usuario.username } no tienes acceso a este recurso!`, 'warning');
      this.router.navigate(['/clientes']);
      return true;
    }
    return false;
  }*/

  getRegiones(): Observable<Region[]> {
    //return this.http.get<Region[]>(this.urlEndPoint + '/clientes/regiones', { headers: this.agregarAuthorizationHeader() }).pipe(
    // la siguiente linea ya no contiene el headers porque se inyecta mediante el interceptor(TokenInterceptor)
    return this.http.get<Region[]>(this.urlEndPoint + '/clientes/regiones')/*.pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    )*/;
  }

  getClientes(page: number): Observable<any> {
    return this.http.get<any>(this.urlEndPoint + '/clientes/page/' + page).pipe(
      tap((response: any) => {
        console.log("ClienteService: Tap 1");
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        })
      }),
      map((response: any) => {
        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          return cliente;
        });
        return response;
      }), tap((response: any) => {
        console.log("ClienteService: Tap 2");
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        })
      })
    );
  }

  /*getClientes(): Observable<Cliente[]> {
    //return of(CLIENTES);
    //this.http.get<Cliente[]>(this.urlEndPoint + '/clientes');
    return this.http.get<any>(this.urlEndPoint + '/clientes').pipe(
      tap(response => {
        let clientes = response as Cliente[]
        console.log("ClienteService: Tap 1");
        clientes.forEach(cliente => {
          console.log(cliente.nombre);
        })
      }),
      map(response => {
        let clientes = response as Cliente[]
        return clientes.map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          //cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US');
          //registerLocaleData(localeCO, 'es-CO');
          //let datePipe = new DatePipe('en-US');
          //let datePipe = new DatePipe('es-CO');
          //cliente.createAt = datePipe.transform(cliente.createAt, 'dd/MM/yyyy');
          //cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy');
          return cliente;
        });
      }), tap(response => {
        console.log("ClienteService: Tap 2");
        response.forEach(cliente => {
          console.log(cliente.nombre);
        })
      })
    );
  }*/

  create(cliente: Cliente): Observable<Cliente> {
    // return this.http.post(this.urlEndPoint + '/clientes', cliente, { headers: this.agregarAuthorizationHeader() }).pipe(
    return this.http.post(this.urlEndPoint + '/clientes', cliente).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError( e => {
        /*if(this.isNoAutorizado(e)) {
          return throwError(e);
        }*/

        if(e.status==400) {
          return throwError(e);
        }

        if(e.error.mensaje) {
          console.log(e.error.mensaje);
        }
        /*swal.fire(e.error.mensaje, e.error.error, 'error');*/
        return throwError(e);
      })
    );
  }

  getCliente(id): Observable<Cliente> {
    //return this.http.get<Cliente>(`${this.urlEndPoint}/clientes/${id}`, { headers: this.agregarAuthorizationHeader() }).pipe(
    return this.http.get<Cliente>(`${this.urlEndPoint}/clientes/${id}`).pipe(
      catchError( e => {
        /*if(this.isNoAutorizado(e)) {
          return throwError(e);
        }*/
        if(e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/clientes']);
          console.log(e.error.mensaje);
        }
        // swal.fire('Error al editar', e.error.mensaje, 'error')
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<any> {
    // return this.http.put<any>(`${this.urlEndPoint}/clientes/${cliente.id}`, cliente, { headers: this.agregarAuthorizationHeader() }).pipe(
    return this.http.put<any>(`${this.urlEndPoint}/clientes/${cliente.id}`, cliente).pipe(
      catchError( e => {
        /*if(this.isNoAutorizado(e)) {
          return throwError(e);
        }*/

        if(e.status==400) {
          return throwError(e);
        }

        if(e.error.mensaje) {
          console.log(e.error.mensaje);
        }
        // swal.fire(e.error.mensaje, e.error.error, 'error')
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Cliente> {
    //return this.http.delete<Cliente>(`${this.urlEndPoint}/clientes/${id}`, { headers: this.agregarAuthorizationHeader() }).pipe(
    return this.http.delete<Cliente>(`${this.urlEndPoint}/clientes/${id}`).pipe(
      catchError( e => {
        /*if(this.isNoAutorizado(e)) {
          return throwError(e);
        }*/

        if(e.error.mensaje) {
          console.log(e.error.mensaje);
        }
        // swal.fire(e.error.mensaje, e.error.error, 'error')
        return throwError(e);
      })
    );
  }

  /*subirFoto(archivo: File, id): Observable<Cliente> {
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    return this.http.post(`${this.urlEndPoint}/clientes/upload`, formData).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError( e => {
        console.log(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error')
        return throwError(e);
      })
    );
  }*/

  subirFoto(archivo: File, id): Observable<HttpEvent<any>> {
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    // ser comenta este bloque porque el headers se agrega mediante el interceptor(TokenInterceptor)
    /*let httpHeaders = new HttpHeaders();
    let token = this.authService.token;

    if(token != null) {
      httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
    }*/

    const req = new HttpRequest('POST', `${this.urlEndPoint}/clientes/upload`, formData, {
      reportProgress: true,
      //headers: httpHeaders
    });

    return this.http.request(req)/*.pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    )*/;
  }
}
