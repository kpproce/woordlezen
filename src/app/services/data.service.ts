import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  // **********   LOKAAL TESTEN?   **************************************************

  lokaalTesten = false; // zet op true om localhost (test) als API bron te gebruiken

  // ********************************************************************************

  userName = 'Rien';
  userWW = '';
  lastEditRights = false;

  constructor(private http: HttpClient) { }

  getLastEditRights(){
    return this.lastEditRights;
  }

  getRemoteData() { // laat ik staan als voorbeeld
    return this.http.get('https://weerlive.nl/api/json-data-10min.php?key=demo&locatie=Amsterdam');
  }

  getDataZinnen(userName: string, userWW: string, deleted: string, nivoMulti: string, containsLetterGroups: string,
    containsText: string, containsTextStart: boolean, maxAantal: number, eersteZinID: number, order: string) {
      const params = '?userName='+ userName + '&userWW=' + userWW + '&nivoMulti='+ nivoMulti
      + '&containsLetterGroups=' + containsLetterGroups
      + '&containsText=' + containsText + '&containsTextStart=' + containsTextStart
      + '&maxAantal='+ maxAantal + '&eersteZinID=' + eersteZinID
      + '&showDeleted=' + deleted + '&order=' + order;
      if (this.lokaalTesten) {
        return this.http.get('http://localhost/php_api_test/apiBasic/read_zinnen.php' + params );
      } else {
        return this.http.get('https://silvermusic.nl/test/apiBasic/read_zinnen.php' + params );
      }
  }

  getAantalDataZinnen(deleted: string, nivoMulti: string, bevatText: string) {
    const params = '?nivoMulti='+ nivoMulti + '&contains=' + bevatText + '&showDeleted=' + deleted;
    if (this.lokaalTesten) {
      return this.http.get('http://localhost/php_api_test/apiBasic/read_aantal.php' + params );
    } else {
      return this.http.get('https://silvermusic.nl/test/apiBasic/read_aantal.php' + params );
    }
  }

  insertDataZin(userName: string, userWW: string, tekst: string, tekstCorrect: string, nivo: number) {
    const params = '?userName='+ userName + '&userWW=' + userWW + '&do=insert&tekst=' + tekst
                    + '&tekstCorrect=' + tekstCorrect + '&nivo=' + nivo;
    if (this.lokaalTesten) {
      return this.http.get('http://localhost/php_api_test/apiBasic/write_zin.php' + params );
    } else {
      return this.http.get('https://silvermusic.nl/test/apiBasic/write_zin.php' + params );
    }
  }

  insertScore(userName: string, userWW: string, zinId: number, scoreTijd: number) {
    const params = '?userName='+ userName + '&userWW=' + userWW + '&zinId=' + zinId + '&scoreTijd=' + scoreTijd;
    // alert(params);
    if (this.lokaalTesten) {
      return this.http.get('http://localhost/php_api_test/apiBasic/write_score.php' + params );
    } else {
      return this.http.get('https://silvermusic.nl/test/apiBasic/write_score.php' + params );
    }
  }

  flipDataDelete(userName: string, userWW: string, id: string) { // voorlopig alleen flipDeleted
    const params = '?userName='+ userName + '&userWW=' + userWW + '&id=' + id + '&do=flipDelete';
    if (this.lokaalTesten) {
      return this.http.get('http://localhost/php_api_test/apiBasic/write_zin.php'+ params);
    } else {
      return this.http.get('https://silvermusic.nl/test/apiBasic/write_zin.php'+ params);
    }
  }

  updateDataTekst(userName: string, userWW: string, id: string, tekst: string, tekstCorrect: string) { //
    const params = '?userName='+ userName + '&userWW=' + userWW + '&id=' + id + '&tekst='
     + tekst + '&tekstCorrect=' + tekstCorrect + '&do=update';
    if (this.lokaalTesten) {
      return this.http.get('http://localhost/php_api_test/apiBasic/write_zin.php'+ params);
    } else {
      return this.http.get('https://silvermusic.nl/test/apiBasic/write_zin.php'+ params);
    }
  }

  checkLogin(userName: string, userWW: string) { //
    const params = '?userName='+ userName + '&userWW=' + userWW;
    if (this.lokaalTesten) {
      return this.http.get('http://localhost/php_api_test/apiBasic/checkLogin.php'+ params);
    } else {
      return this.http.get('https://silvermusic.nl/test/apiBasic/checkLogin.php'+ params);
    }
  }

  getLoginButtonColor() {
   if ( this.lastEditRights) {
     return 'success';
   } else {
    return 'danger';
   }
  }

  getEditVisible(){
    if (this.getLastEditRights()) {
      return 'visible';
    } else {
      return 'hidden';
    }
  }

}
