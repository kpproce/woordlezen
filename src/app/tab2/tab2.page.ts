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
  constructor(private dataService: DataService) {}

  addNewZinToDatabaseApi() {
  //saveNewZin() {
    this.dataService.insertNewRemoteDataZin(this.zinTekst).subscribe(result => {
      this.resultFromDataService=result;
      console.log(this.resultFromDataService);
    });
  }

}
