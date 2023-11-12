import { Component, Input } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { IUser } from '../interfaces/auth.interface';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  @Input() user!: IUser;
  constructor(public auth: AuthService, public lang: LanguageService) {
    if (this.user?.locale) this.lang.setLocale(this.user.locale);
  }
}
