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

  getLocalData() {
    return this.http.get('/assets/data/songs.json');
  }

  getLastEditRights(){
    return this.lastEditRights;
  }

  getRemoteData() {
    return this.http.get('https://weerlive.nl/api/json-data-10min.php?key=demo&locatie=Amsterdam');
  }

  getDataZinnen(userName: string, userWW: string, deleted: string, order: string) {
    const params = '?userName='+ userName + '&userWW=' + userWW + '&showDeleted=' + deleted + '&order=' + order;
    if (this.lokaalTesten) {
      return this.http.get('http://localhost/php_api_test/apiBasic/read_zinnen.php' + params );
      //http://localhost/php_api_test/apiBasic/read_zinnen.php?showDeleted=all&order=random;
    } else {
      return this.http.get('https://silvermusic.nl/test/apiBasic/read_zinnen.php' + params );
    }
  }

  insertDataZin(userName: string, userWW: string, tekst: string, nivo: number) {
    const params = '?userName='+ userName + '&userWW=' + userWW + '&do=insert&tekst=' + tekst + '&nivo=' + nivo;
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

  updateDataTekst(userName: string, userWW: string, id: string, tekst: string) { //
    const params = '?userName='+ userName + '&userWW=' + userWW + '&id=' + id + '&tekst=' + tekst + '&do=update';
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
