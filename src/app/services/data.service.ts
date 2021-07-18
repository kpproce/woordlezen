import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  lokaalTesten = false; // zet op true om localhost (test) als API bron te gebruiken

  constructor(private http: HttpClient) { }

  getLocalData() {
    return this.http.get('/assets/data/songs.json');
  }

  getRemoteData() {
    return this.http.get('https://weerlive.nl/api/json-data-10min.php?key=demo&locatie=Amsterdam');
  }

  getDataZinnen(deleted: string) {
    if (this.lokaalTesten) {
      return this.http.get('http://localhost/php_api_test/apiBasic/read_zinnen.php?showDeleted='+deleted);
    } else {
      return this.http.get('https://silvermusic.nl/test/apiBasic/read_zinnen.php?showDeleted='+deleted);
    }
  }

  insertDataZin(tekst: string, nivo: number) {
    const params = '?do=insert&tekst=' + tekst + '&nivo=' + nivo;
    if (this.lokaalTesten) {
      return this.http.get('http://localhost/php_api_test/apiBasic/write_zin.php'+ params );
    } else {
      return this.http.get('https://silvermusic.nl/test/apiBasic/write_zin.php'+ params );
    }
  }

  insertScore(userName: string, userWW: string, zinId: number, scoreTijd: number) {
    const params = '?userName='+ userName + '&userWW=' + userWW + '&zinId=' + zinId + '&scoreTijd=' + scoreTijd;
    // alert(params);
    if (this.lokaalTesten) {
      return this.http.get('http://localhost/php_api_test/apiBasic/write_score.php'+ params );
    } else {
      return this.http.get('https://silvermusic.nl/test/apiBasic/write_score.php'+ params );
    }
  }

  updateDataZin(id: string) { // voorlopig alleen flipDeleted
    const params = '?id=' + id + '&do=flipDelete';
    if (this.lokaalTesten) {
      return this.http.get('http://localhost/php_api_test/apiBasic/write_zin.php'+ params);
    } else {
      return this.http.get('https://silvermusic.nl/test/apiBasic/write_zin.php'+ params);
    }
  }

}
