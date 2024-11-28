import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Profesor } from '../interfaces/profesor';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {
  private apiUrl = 'https://academicoapi.onrender.com/profesor';


  constructor(private http: HttpClient) { }

  getProfesores():Observable<Profesor[]>{
    return this.http.get<Profesor[]>(this.apiUrl);
  }
  updateProfesor(id: number, profesorData: Partial<Profesor>): Observable<Profesor> {
    return this.http.patch<Profesor>(`${this.apiUrl}/${id}`, profesorData).pipe(
    );
  }
  addProfesor(profesor: Profesor): Observable<Profesor> {
  return this.http.post<Profesor>(this.apiUrl , profesor);
}

}
