import { stringify } from '@angular/compiler/src/util';
import { Component } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page {
  zinTekst = '';
  zinNivo = 2;
  resultFromDataService: any;
  resultFromDataServiceTXT = '-- geen info';
  wwClass='small login lightRed';

  constructor(private dataService: DataService) {
  }

  checkLogin() {
    alert ('ingelogd: ' + this.dataService.lastEditRights);
  }


  addNewZinToDatabaseApi() {
  //saveNewZin() {
    this.dataService.insertDataZin(this.dataService.userName, this.dataService.userWW, this.zinTekst, this.zinNivo).subscribe(result => {
      this.resultFromDataService=result;
      // this.resultFromDataServiceTXT = stringify(this.resultFromDataService);
      this.resultFromDataServiceTXT = this.resultFromDataService.message;
      this.dataService.lastEditRights  =  (this.resultFromDataService.ingelogd); // dit moet cleaner..
      if ( this.dataService.getLastEditRights()) {
        this.wwClass='small login lightGreen';
        // alert('test1:' + this.wwClass);
      } else {
        this.wwClass='small login lightRed';
        // alert('test2:'+ this.wwClass);
      }
    });
  }
}
