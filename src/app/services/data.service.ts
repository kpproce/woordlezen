import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getLocalData() {
    return this.http.get('/assets/data/songs.json');
  }

  getRemoteData() {
    return this.http.get('https://weerlive.nl/api/json-data-10min.php?key=demo&locatie=Amsterdam');
  }

  getRemoteDataZinnen() {
    return this.http.get('https://silvermusic.nl/test/apiBasic/read_zinnen.php');
  }

  insertNewRemoteDataZin(tekst: string) {
    return this.http.get('https://silvermusic.nl/test/apiBasic/write_zin.php?tekst='+ tekst );
  }

}
