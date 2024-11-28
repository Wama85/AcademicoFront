import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Materia} from '../interfaces/materia'
@Injectable({
  providedIn: 'root'
})
export class MateriaService {
  urlApi:string='https://academicoapi.onrender.com/materias'
  constructor(private readonly http: HttpClient) {
  }
  getMaterias():Observable<Materia[]>{
    return this.http.get<Materia[]>(this.urlApi);
  }
  postMateria(materia:Materia):Observable<Materia>{
    return this.http.post<Materia>(this.urlApi,materia);
  }
}
