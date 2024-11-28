import { Injectable } from '@angular/core';
import { CanActivate, Router,ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../servicios/auth.service'; // Asumimos que tienes un AuthService que maneja la autenticación


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['roles'][0]; 
    const userRole = this.authService.getUserType(); 

    if (userRole === expectedRole) {
      return true;
    } else {
      console.log(userRole);
      console.log(expectedRole);


      this.router.navigate(['']); 
      return false;
    }
  }
}
