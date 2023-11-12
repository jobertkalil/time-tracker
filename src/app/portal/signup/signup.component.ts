import { Component } from '@angular/core';
import { IUser } from 'src/app/interfaces/auth.interface';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  user: IUser;
  constructor(public auth: AuthService, public lang: LanguageService) {
    this.user = {
      uid: '',
      userID: '',
      email: '',
      firstName: '',
      lastName: '',
      role: '',
      photoURL: '',
      displayName: '',
      password: '',
    };
  }

  signUp() {
    this.auth.signUp(this.user);
  }
}
