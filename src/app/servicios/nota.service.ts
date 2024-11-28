import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Nota } from '../interfaces/nota';
import { MateriaAsignadaDocente } from '../interfaces/materia-asignada-docente';
import { Materias } from '../interfaces/materias'
import { Estudiante } from '../interfaces/estudiante';

@Injectable({
  providedIn: 'root',
})
export class NotaService {

  private apiUrl = 'https://academicoapi.onrender.com'; // Cambia esto a tu URL de API real

  constructor(private http: HttpClient) {}

  obtenerProfesores(): Observable<MateriaAsignadaDocente[]> {
    return this.http.get<MateriaAsignadaDocente[]>(`${this.apiUrl}/materia-asignada-profesor`);
  }
  obtenerEstudiantes(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(`${this.apiUrl}/estudiante`);
  }

  obtenerMateriasAsignadas(): Observable<Materias[]> {
    return this.http.get<Materias[]>(`${this.apiUrl}/materias`);
  }

  obtenerTodasLasNotas(): Observable<Nota[]> {
    return this.http.get<Nota[]>(`${this.apiUrl}/nota`);
  }


  obtenerNotasPorAno(selectedYear: number): Observable<Nota[]> {
    return this.http.get<Nota[]>(`${this.apiUrl}/nota`).pipe(
      catchError(error => {
        console.error('Error al obtener notas:', error);
        return of([]); // Retorna un array vacío en caso de error
      }),
      map(notas =>
        notas
          .map((nota: Nota) => ({
            ...nota,
            fecha: new Date(nota.fecha), // Convierte la cadena de fecha a un objeto Date
            materiaAsignada: {
              ...nota.materiaAsignada,
              fecha: new Date(nota.materiaAsignada.fecha) // Convierte también la fecha de materiaAsignada
            }
          }))
          .filter((nota: Nota) => new Date(nota.fecha).getFullYear() === selectedYear) // Filtra las notas por año
      )
    );
  }
}
