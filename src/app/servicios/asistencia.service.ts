import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MateriaAsignadaDocente } from '../interfaces/materia-asignada-docente';
import { Asistencia } from '../interfaces/asistencia';
import { map } from 'rxjs/operators';
// import { parse, format } from 'date-fns';
@Injectable({
  providedIn: 'root',
})
export class AsistenciaService {
  asistencias: any = {};
  private urlApi: string =
    'https://academicoapi.onrender.com/materia-asignada-profesor/asistencias';

  constructor(private http: HttpClient) {}

  getAsistenciasDeMateriaAsignada(
    id?: number
  ): Observable<MateriaAsignadaDocente> {
    return this.http.get<MateriaAsignadaDocente>(`${this.urlApi}/${id}`);
  }

  getAsistenciasAgrupadasPor(asistencias?: any[]):any[]{
    return Object.entries(
      asistencias?.reduce((acc: any, asistencia: any) => {
        const nombreEstudiante = `${asistencia.estudiante.apellido} ${asistencia.estudiante?.nombre}`;
          (acc[nombreEstudiante] = acc[nombreEstudiante] || []).push(
            asistencia
          );
        return acc;
      }, {})
    ).map(([nombre, asistencias]) => ({ nombre, asistencias }));
  }
  getAsistenciasInscripcionAgrupadasPor(inscripciones?: any[]):any[]{
    return Object.entries(
      inscripciones?.reduce((acc: any, asistencia: any) => {
        const nombreEstudiante = `${asistencia.estudiante?.apellido} ${asistencia.estudiante?.nombre}`;
          acc[nombreEstudiante]=[]
        return acc;
      }, {})
    ).map(([nombre, asistencias]) => ({ nombre, asistencias }));
  }
  getAsistenciasAgrupadasPorEstudiante(asistencias?: any[]): any[] {
    this.asistencias = this.getAsistenciasAgrupadasPor(asistencias);
    return this.asistencias;
  }

  getAsistenciasInscripcionAgrupadasPorEstudiante(inscripciones?: any[]): any[] {
    this.asistencias = this.getAsistenciasInscripcionAgrupadasPor(inscripciones);
    console.log("hh",this.asistencias)
    return this.asistencias;
  }



  getUniqueFechas(): string[] {
    const fechas = new Set<string>();
    this.asistencias.forEach((alumno: any) => {
      alumno.asistencias.forEach((asistencia: Asistencia) => {
        let fecha=new Date(asistencia.fecha_asistencia+"T00:00:00").toLocaleDateString()
        fechas.add(fecha);
      });
    });
    return Array.from(fechas);
  }

  getAsistenciaPorFecha(asistencias: Asistencia[], fecha: string):Asistencia|undefined {

    const asistencia = asistencias.find(
      (a) =>
            new Date(a.fecha_asistencia+"T00:00:00").toLocaleDateString() === fecha
    );
    return asistencia;
  }

  guardarAsistencia(asistencia:Asistencia):Observable<number>{
    return this.http.post<Asistencia>("http://localhost:3000/asistencia", asistencia)
    .pipe(
      map((response: Asistencia) => response.id_asistencia|| -1)
    );
  }
  guardarAsistencias(asistencia:Asistencia[]):Observable<Asistencia[]>{
    return this.http.post<Asistencia[]>("http://localhost:3000/asistencia/all", asistencia)
  }

  actualizarAsistencia(id:number,asistencia:any):Observable<Asistencia>{
    return this.http.patch<Asistencia>(`http://localhost:3000/asistencia/${id}`, asistencia)
  }

  eliminarAsistencia(id:number):Observable<Asistencia>{
    return this.http.delete<Asistencia>(`http://localhost:3000/asistencia/${id}`)
  }
   // Método para obtener asistencias por estudiante y materia
   getAsistenciasPorEstudianteYMateria(idEstudiante: number, idMateria: number): Observable<Asistencia[]> {
    const url = `${this.urlApi}/estudiante/${idEstudiante}/materia/${idMateria}`;
    return this.http.get<Asistencia[]>(url);
  }
}
