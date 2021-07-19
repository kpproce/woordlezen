import { Component } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  zinnen;
  zinnen2;
  aantalZinnen = 0;
  zinnenIndex = 0;

  resultFromDataService: any;
  resultFromDataServiceTXT = 'geen update info';

  actualZin = 'geen data gevonden checkdata connectie';

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getDataZinnen('all','id').subscribe(data => {
      this.zinnen=data;
      this.zinnen2=JSON.parse(JSON.stringify(data));
      this.aantalZinnen = this.zinnen2.length;

      console.log('remote data zinnen:');
      console.log(this.zinnen);
      console.log('Remote data zinnen (stringyfied and parsed):');
      console.log(this.zinnen2);
      this.actualZin = this.zinnen2[this.zinnenIndex].tekst;
    });

  }
  handleClickDelete(id: string){
      // de api wijzigt de deleted (zichtbaarheid)
      //saveNewZin() {
          this.dataService.updateDataZin(id).subscribe(result => {
          this.resultFromDataService=result;
          // this.resultFromDataServiceTXT = stringify(this.resultFromDataService);
          this.resultFromDataServiceTXT = JSON.stringify(result);
          this.dataService.getDataZinnen('all','id').subscribe(data => {
            this.zinnen=data;
            this.zinnen2=JSON.parse(JSON.stringify(data));
            this.aantalZinnen = this.zinnen2.length;
            this.actualZin = this.zinnen2[this.zinnenIndex].tekst;
          });
        });
  }
}
