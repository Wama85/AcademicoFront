import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError,map } from 'rxjs/operators';
import { Estudiante } from '../interfaces/estudiante';
import { MateriaAsignadaDocente } from '../interfaces/materia-asignada-docente';  // Importa la interfaz

@Injectable({
  providedIn: 'root'
})
export class AdminAsignarEstudiantesMateriaService {

  private apiUrl = 'https://academicoapi.onrender.com/inscripcion';

  constructor(private http: HttpClient) {}

  registrarInscripcion(MateriaAsignadaDocente: MateriaAsignadaDocente): Observable<any> {
    return this.http.post('/api/inscripciones', MateriaAsignadaDocente);
  }

  eliminarInscripcion(id_estudiante: number, id_dicta: number) {
    return this.http.delete(`/api/inscripciones/${id_estudiante}/${id_dicta}`);
  }



}
