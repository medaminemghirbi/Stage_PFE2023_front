import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  messageError:any

  registerr:any = "https://imgs.bharatmatrimony.com/bmimgs/login/login-otp-banner.png";
  constructor(private freelancersService:AuthService,private router:Router) { }

  ngOnInit(): void {
  }

  register(f: any) {
    let data = f.value;
    let registerButton = document.getElementById('registerButton') as HTMLButtonElement;
    registerButton.disabled = true;
    registerButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';

    if (data.email.length !== 0) {
      (async () => {
        try {
          const response = await this.freelancersService.register(data).toPromise();
          Swal.fire('Whooa!', 'Account successful created, Activate Email to access account profile!', 'success')
          .then(() => {
            registerButton.disabled = false;
            registerButton.innerHTML = 'Register';

          });
        } catch (error) {

          console.log(error);

          if (error instanceof HttpErrorResponse) {
            registerButton.disabled = false;
            this.messageError = "Email taken";
          }
        }
      })();
    } else {
      this.messageError = "Champs required";
    }
  }

}