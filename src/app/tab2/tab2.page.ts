import { stringify } from '@angular/compiler/src/util';
import { Component } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  zinTekst = 'type hier je zin';
  zinNivo = 2;
  resultFromDataService: any;
  resultFromDataServiceTXT = '-- geen info';

  constructor(private dataService: DataService) {
  }

  addNewZinToDatabaseApi() {
  //saveNewZin() {
    this.dataService.insertDataZin(this.zinTekst).subscribe(result => {
      this.resultFromDataService=result;
      // this.resultFromDataServiceTXT = stringify(this.resultFromDataService);
      this.resultFromDataServiceTXT = ' tekst opgeslagen';
    });
  }
}
