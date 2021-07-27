import { Component } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  teller = 0;
  idVanAangepasteZin = 0;
  zinnen;
  zinnen2;
  aantalZinnen = 0;
  zinnenIndex = 0;
  zinTekst ='leeg';

  resultFromDataService: any;
  resultFromDataServiceTXT = 'geen update info';
  dataOpgeslagen = false;

  actualZin = 'geen data gevonden checkdata connectie';
  info= '---';

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getDataZinnen(this.dataService.userName, this.dataService.userWW, 'all', '(1,2,3,4)', 'id').subscribe(data => {
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
    this.dataService.flipDataDelete(this.dataService.userName, this.dataService.userWW, id).subscribe(result => {
      this.resultFromDataService=result;
      // this.resultFromDataServiceTXT = stringify(this.resultFromDataService);
      this.resultFromDataServiceTXT = JSON.stringify(result);
      this.dataService.getDataZinnen(this.dataService.userName, this.dataService.userWW, 'all', '(1,2,3,4)','id').subscribe(data => {
        this.zinnen=data;
        this.zinnen2=JSON.parse(JSON.stringify(data));
        this.aantalZinnen = this.zinnen2.length;
        this.actualZin = this.zinnen2[this.zinnenIndex].tekst;
      });
      const result2= JSON.parse(this.resultFromDataServiceTXT);
      this.dataOpgeslagen = (result2.ingelogd==='ja');
      this.dataService.lastEditRights  =  this.dataOpgeslagen; // dit moet cleaner..
      if (this.dataOpgeslagen) {
        this.info = 'wijzig zichtbaarheid opgeslagen ';
      } else {
        this.info = 'wijzig zichtbaarheid NIET opgeslagen ';
      }
      alert('flip delete.. Ingelogd: '+ result2.ingelogd + ' -- ' + result2.message);
    });
  }

  handleUpdateTekst(id: string, tekst: string){
    // de api wijzigt de deleted (zichtbaarheid)
    //saveNewZin() {
    this.dataService.updateDataTekst(this.dataService.userName, this.dataService.userWW, id, tekst).subscribe(result => {
      this.resultFromDataService=result;
      // this.resultFromDataServiceTXT = stringify(this.resultFromDataService);
      this.resultFromDataServiceTXT = JSON.stringify(result);

      const result2= JSON.parse(this.resultFromDataServiceTXT);
      this.dataOpgeslagen = (result2.ingelogd==='ja');
      this.dataService.lastEditRights  =  this.dataOpgeslagen; // dit moet cleaner..
      if (this.dataOpgeslagen) {
        this.info = this.info +  ' opgeslagen ';
      } else {
        this.info = this.info +  ' NIET opgeslagen ';
      }
      alert('Ingelogd: '+ result2.ingelogd + ' -- ' + result2.message);
    });
  }

  onchangeInput(id) {
    this.teller +=1;
    this.idVanAangepasteZin=id;
    this.info = 'id: ' + id + ' tekst aangepast (' + this.teller + ') keer';
  }
  onBlurInput(id, tekst) {
    this.teller +=1;
    if (this.idVanAangepasteZin===id) {
      //alert ('1) this.dataOpgeslagen: ' + this.dataOpgeslagen);
      this.handleUpdateTekst(id, tekst);
      this.info ='id: (' + id + ') Wijziging ';
      //alert ('3) this.dataOpgeslagen: ' + this.dataOpgeslagen);

    }
    this.idVanAangepasteZin = 0;
    this.teller = 0;
  }
}
