import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Estudiante } from '../interfaces/estudiante';

@Injectable({
  providedIn: 'root'
})
export class PerfilEstudianteService {

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

  actualizarEstudiante(id: number, estudiante: Partial<Estudiante>): Observable<Estudiante> {
    return this.http.patch<Estudiante>(`${this.apiUrl}/${id}`, estudiante).pipe(
      catchError(this.handleError)
    );
  }



  private handleError(error: HttpErrorResponse) {
    // Puedes personalizar este manejo de errores según tu necesidad
    console.error('Ocurrió un error:', error);
    return throwError('Algo salió mal; por favor intente de nuevo más tarde.');
  }
}
