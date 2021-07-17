import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  lokaalTesten = true; // zet op true om localhost als API bron te gebruiken

  constructor(private http: HttpClient) { }

  getLocalData() {
    return this.http.get('/assets/data/songs.json');
  }

  getRemoteData() {
    return this.http.get('https://weerlive.nl/api/json-data-10min.php?key=demo&locatie=Amsterdam');
  }

  getDataZinnen() {
    if (this.lokaalTesten) {
      return this.http.get('http://localhost/php_api_test/apiBasic/read_zinnen.php');
    } else {
      return this.http.get('https://silvermusic.nl/test/apiBasic/read_zinnen.php');
    }
  }

  insertDataZin(tekst: string) {
    if (this.lokaalTesten) {
      return this.http.get('http://localhost/php_api_test/apiBasic/write_zin.php?tekst='+ tekst );
    } else {
      return this.http.get('https://silvermusic.nl/test/apiBasic/write_zin.php?tekst='+ tekst );
    }
  }

  updateDataZin(id: string) {
    const params = '?id=' + id + '&do=flipDelete';
    if (this.lokaalTesten) {
      return this.http.get('http://localhost/php_api_test/apiBasic/write_zin.php'+ params);
    } else {
      return this.http.get('https://silvermusic.nl/test/apiBasic/write_zin.php'+ params);
    }
  }

}
