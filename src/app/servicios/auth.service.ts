// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,BehaviorSubject  } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'https://academicoapi.onrender.com/auth/login';
  private estudianteUrl  ='https://academicoapi.onrender.com/estudiante';
  private userSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {

    console.log(email);
    console.log(password);
    return this.http.post(this.loginUrl, { email:email, password:password });
  }



  saveUserData(user: any): void {

    localStorage.setItem('userId', user.id_estudiante || user.id_profesor || '');
    localStorage.setItem('userType', user.tipo);
    localStorage.setItem('userProfilePic', user.foto || '');

    let id:number=0;
    if(user.tipo=="estudiante"){
      id=user.id_estudiante;
    }else if(user.tipo=="profesor"){
      id=user.id_profesor
    } else{
      id=user.id_admin;
    }

    localStorage.setItem('userId', id.toString());
    localStorage.setItem('userType', user.tipo);

  }

  getUserType(): string | null {
    return localStorage.getItem('userType');
  }

  getUserId(): number | 0 {
    return Number(localStorage.getItem('userId'));
  }
  getUserProfilePic(): string | null {
    return localStorage.getItem('userProfilePic');
  }

  obtenerFotoPerfil(id: number): Observable<any> {
    return this.http.get(`${this.estudianteUrl}/${id}`);
  }

  logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    localStorage.removeItem('userProfilePic');
    this.userSubject.next(null);
  }

  isAuthenticated(): boolean {

    return !!localStorage.getItem('userId');
  }

  getUserObservable(): Observable<any> {
    return this.userSubject.asObservable();
  }
}


