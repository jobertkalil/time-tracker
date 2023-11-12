import { Injectable } from '@angular/core';
import { locale } from '../../locale/locale';
import { IGenericObject } from '../interfaces/app.interface';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private lang: string;

  constructor() {
    this.lang = 'en';
  }

  setLocale(lang: string = 'en') {
    this.lang = lang;
  }
  get(key: string): string {
    const translations = (locale as IGenericObject)[this.lang];
    if (translations) {
      return (translations as IGenericObject)[key] || key;
    }
    return key;
  }
}
