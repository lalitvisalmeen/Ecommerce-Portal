import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  imports: [AsyncPipe, RouterLink],
  selector: 'app-login-callback',
  styleUrl: './login-callback.css',
  templateUrl: './login-callback.html',
})
export class LoginCallback {
   private auth = inject(AuthService);

  isLoading$ = this.auth.isLoading$;
  error$ = this.auth.error$;
}
