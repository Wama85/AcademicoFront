import { Component,Input } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MensajeService } from '../mensaje/mensaje.component';
import { SelectionColorService } from '../../servicios/selection-color.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass'
})
export class LoginComponent {
  selectedColor: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;
  passwordType: string = 'password';
  showPassword: boolean = false;
  eyeIcon: string = '../../../assets/img/ver.png';
  constructor(
    private colorService: SelectionColorService,
    private authService: AuthService,
    private router: Router,
    private mensajeService: MensajeService
  ) {}

  ngOnInit() {
    this.colorService.currentColor$.subscribe(color => {
      this.selectedColor = color; // Actualiza el color recibido
      console.log('Color recibido en Login:', this.selectedColor);
    });
  }

  getColorClass(): string {
    switch (this.selectedColor) {
      case 'verde':
        return 'color-verde';
      case 'amarillo':
        return 'color-amarillo';
      default:
        return 'color-azul';
    }
  }



    login() {
      this.authService.login(this.email, this.password).subscribe({
          next: (response) => {
              console.log("Respuesta completa del login:", response);
              if (response && response.usuario) {
                  this.authService.saveUserData(response.usuario);
                  this.router.navigate(['/home']);
              } else {
                  console.error("La respuesta no contiene los datos esperados de usuario.");
                  this.mensajeService.mostrarMensajeError("Error", "Datos de usuario no recibidos.");

              }
          },
          error: (err) => {
              console.error('Error en el login:', err);
              this.mensajeService.mostrarMensajeError("¡Error!", "La contraseña o su correo es incorrecto");
          }
      });
  }

  togglePassword() {

    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.eyeIcon = '../../../assets/img/esconder.png';
    } else {
      this.passwordType = 'password';
      this.eyeIcon = '../../../assets/img/ver.png'; 
    }
  }


}

