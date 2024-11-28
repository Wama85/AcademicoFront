import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Estudiante } from '../interfaces/estudiante';
import {Nota} from '../interfaces/notas'
import { MateriaAsignadaDocente } from '../interfaces/materia-asignada-docente';

@Injectable({
  providedIn: 'root'
})
export class NotasProfesorService {


  private apiUrl = 'https://academicoapi.onrender.com';

  constructor(private http: HttpClient) {}

  // Obtener datos del estudiante
  getEstudiante(id: number): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(`${this.apiUrl}/estudiante`).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener notas de un estudiante
  getNota(): Observable<Nota[]> {
    return this.http.get<Nota[]>(`${this.apiUrl}/nota`).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener materias asignadas a un profesor
  getMateriaAsignadaProfesor(id: number): Observable<MateriaAsignadaDocente> {
    return this.http.get<MateriaAsignadaDocente>(`${this.apiUrl}/materia-asignada-profesor/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código: ${error.status}\nMensaje: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
