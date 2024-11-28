import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError,map } from 'rxjs/operators';
import { Estudiante } from '../interfaces/estudiante';


@Injectable({
  providedIn: 'root'
})
export class EstudiantesAdminService {

  private apiUrl = 'https://academicoapi.onrender.com/estudiante';


  constructor(private http: HttpClient) { }

  obtenerListaEstudiantes(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }
  obtenerEstudiantePorId(id: number): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  obtenerUltimoEstudiante(): Observable<Estudiante | null> {
    return this.http.get<Estudiante[]>(this.apiUrl).pipe(
      map(estudiantes => estudiantes.length ? estudiantes[estudiantes.length - 1] : null),
      catchError(this.handleError)
    );
  }

  actualizarEstudiante(id: number, estudiante: Partial<Estudiante>): Observable<Estudiante> {
    return this.http.patch<Estudiante>(`https://academicoapi.onrender.com/auth/update/estudiante/${id}`, estudiante).pipe(
      catchError(this.handleError)
    );
  }


  addEstudiante(estudiante: Estudiante): Observable<Estudiante> {
    return this.http.post<Estudiante>('https://academicoapi.onrender.com/auth/register/estudiante', estudiante).pipe(
    catchError(this.handleError)
    );
  }

  buscarEstudiante(nombre: string, apellido: string): Observable<any> {
    return this.http.get(`/api/estudiantes?nombre=${nombre}&apellido=${apellido}`);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Ocurrió un error:', error);
    return throwError('Algo salió mal; por favor intente de nuevo más tarde.');
  }
}
