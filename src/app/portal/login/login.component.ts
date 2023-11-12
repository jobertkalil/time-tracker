import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { IUser, UserState } from 'src/app/interfaces/auth.interface';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy {
  userState = UserState.noUser;
  invalidCredentials = false;
  errorMessage = '';
  password: string;
  email: string;

  private ngUnsubscribe = new Subject<void>();

  constructor(
    public auth: AuthService,
    private router: Router,
    public lang: LanguageService
  ) {
    this.auth.user$.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (user: IUser) => {
        if (user) this.userState = UserState.loggedIn;
        else this.userState = UserState.guest;
      },
      error: (error: any) => {
        console.log('Error:', error);
        this.userState = UserState.guest;
      },
    });
    this.password = '';
    this.email = '';
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  login() {
    this.invalidCredentials = false;
    this.errorMessage = '';
    this.auth
      .login(this.email, this.password)
      .then((userCredential: any) => {
        // Signed in
        const user = userCredential.user;
        if (user) {
          this.router.navigate(['/']);
          this.reset();
        }
      })
      .catch((error: any) => {
        this.errorMessage =
          'Invalid credentials. Please check your email and password.';
        this.invalidCredentials = true;
        console.log('Error:', error);
      });
  }

  private reset() {
    this.invalidCredentials = false;
    this.errorMessage = '';
    this.email = '';
    this.password = '';
    this.userState = UserState.guest;
  }
}
