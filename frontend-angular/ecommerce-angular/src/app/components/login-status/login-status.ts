import { Component, DOCUMENT, Inject, output, signal } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  imports: [],
  selector: 'app-login-status',
  styleUrl: './login-status.css',
  templateUrl: './login-status.html',
})
export class LoginStatus {
  isAuthenticated = signal(false);
  profileJson: string | undefined;
  userEmail = signal<string | undefined>(undefined);
  storage: Storage = sessionStorage;
  accountMenuOpen = signal(false);

  constructor(private auth: AuthService, @Inject(DOCUMENT) private doc: Document) { }

  ngOnInit(): void {
    this.auth.isAuthenticated$.subscribe((authenticated: boolean) => {
      this.isAuthenticated.set(authenticated);
      console.log('User is authenticated: ', this.isAuthenticated);
    });

    this.auth.user$.subscribe((user) => {
      this.userEmail.set(user?.email);
      this.storage.setItem('userEmail', JSON.stringify(this.userEmail()));
      console.log('User ID: ', this.userEmail);
    });
  }

  login() {
    this.auth.loginWithRedirect();
  }

  logout() {

    this.auth.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });

    this.accountMenuOpen.set(false);

  }

  toggleAccountMenu() {

    this.accountMenuOpen.update(value => !value);
  }

}
