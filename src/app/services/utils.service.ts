import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  formatStrToHtml(str: string) {
    return str.replaceAll('\\n', '<br>');
  }
}
