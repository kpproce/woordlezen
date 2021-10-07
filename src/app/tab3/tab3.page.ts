import { Component } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  laatsteZinID = 0;
  teller = 0;
  idVanAangepasteZin = 0;
  zinnen;
  zinnen2;
  aantalZinnenVanApi = 0;
  aantalZinnenVanApiObj;
  aantalZinnenVanApiSQL=0;
  aantalZinnen = 0;
  zinnenIndex = 0;
  zinTekst ='leeg';

  filterStringVooraf = 'a';
  filterString = '';
  filterVoorafBegintMet = true ;

  resultFromDataService: any;
  resultFromDataServiceTXT = 'geen update info';
  dataOpgeslagen = false;

  actualZin = 'geen data gevonden checkdata connectie';
  info= '---';

  constructor(private dataService: DataService) {}

  ngOnInit() {
    /* voorbeeld:
      this.dataService.getDataZinnen(this.dataService.userName, this.dataService.userWW,
      'nee', nivo, containsLetterGroups1, this.containsText, false, 20, -1, 'random').subscribe(data => {
    */
    this.dataService.getDataZinnen(this.dataService.userName, this.dataService.userWW,
        'all', '(0,1,2,3,4)', 'all', this.filterStringVooraf, this.filterVoorafBegintMet, 100, this.laatsteZinID, 'id').subscribe(data => {
      this.zinnen=data;
      this.zinnen2=JSON.parse(JSON.stringify(data));
      this.aantalZinnen = this.zinnen2.length;
      this.actualZin = this.zinnen2[this.zinnenIndex].tekst;

    });
  }

  setLaatsteZinID(welke: string){ // gebruikt om volgende batch op te halen
    if (welke === 'next') {
      this.laatsteZinID = this.zinnen[this.zinnen2.length-1].id;
     } else {
      this.laatsteZinID = 0;
     }

    this.teller=0;
    this.dataService.getDataZinnen(this.dataService.userName, this.dataService.userWW,
        'all', '(0,1,2,3,4)', 'all', this.filterStringVooraf, this.filterVoorafBegintMet, 100, this.laatsteZinID, 'id').subscribe(data => {
      this.zinnen=data;
      this.zinnen2=JSON.parse(JSON.stringify(data));
      this.aantalZinnen = this.zinnen2.length;
      this.actualZin = this.zinnen2[this.zinnenIndex].tekst;
    });
    // alert ('ionVi
  }

  ionViewWillEnter(){
    this.teller=0;
    this.dataService.getDataZinnen(this.dataService.userName, this.dataService.userWW,
        'all', '(0,1,2,3,4)', 'all', this.filterStringVooraf, this.filterVoorafBegintMet, 100, this.laatsteZinID, 'id').subscribe(data => {
      this.zinnen2=JSON.parse(JSON.stringify(data));
      this.aantalZinnen = this.zinnen2.length;
      this.actualZin = this.zinnen2[this.zinnenIndex].tekst;
    });
    this.dataService.getAantalDataZinnen('all', '(0,1,2,3,4)', 'all').subscribe(data => {
      this.aantalZinnenVanApi = JSON.parse(JSON.stringify(data)).resultData[0].aantal;
      console.log(this.aantalZinnenVanApi);
      // this.actualZin = this.zinnen2[this.zinnenIndex].tekst;
    });
    // alert ('ionView-Will-Enter');
  }

  handleCheckAantalZinnenViaApi(){
    this.dataService.getAantalDataZinnen('all', '(0,1,2,3,4)', 'all').subscribe(data => {
      this.aantalZinnenVanApi = JSON.parse(JSON.stringify(data)).resultData[0].aantal;
      console.log(this.aantalZinnenVanApi);
      // this.actualZin = this.zinnen2[this.zinnenIndex].tekst;
    });
  }

  handleClickDelete(id: string){
    // de api wijzigt de deleted (zichtbaarheid)
    //saveNewZin() {
    this.dataService.flipDataDelete(this.dataService.userName, this.dataService.userWW, id).subscribe(result => {
      this.resultFromDataService=result;
      // this.resultFromDataServiceTXT = stringify(this.resultFromDataService);
      this.resultFromDataServiceTXT = JSON.stringify(result);
      this.dataService.getDataZinnen(this.dataService.userName, this.dataService.userWW,
          'all', '(1,2,3,4)', 'all', this.filterStringVooraf, this.filterVoorafBegintMet, -1, this.laatsteZinID, 'id').subscribe(data => {
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

  handleUpdateTekst(id: string, tekst: string, tekstCorrect: string){
    // de api wijzigt de deleted (zichtbaarheid)
    //saveNewZin() {
    this.dataService.updateDataTekst(this.dataService.userName, this.dataService.userWW, id, tekst, tekstCorrect).subscribe(result => {
      this.resultFromDataService=result;
      // this.resultFromDataServiceTXT = stringify(this.resultFromDataService);
      this.resultFromDataServiceTXT = JSON.stringify(result);
      const result2= JSON.parse(this.resultFromDataServiceTXT);
      this.dataOpgeslagen = (result2.ingelogd);
      this.dataService.lastEditRights  = result2.ingelogd; // dit moet cleaner..
      if (this.dataOpgeslagen) {
        this.info = this.info +  ' opgeslagen ';
      } else {
        this.info = this.info +  ' NIET opgeslagen ';
      }
      //alert('Ingelogd: '+ result2.ingelogd + ' -- ' + result2.message);
    });
  }

  onchangeTekst(id) {
    this.teller +=1;
    this.idVanAangepasteZin=id;
    this.info = 'id: ' + id + ' tekst aangepast (' + this.teller + ') keer';
  }

  onBlurTekst(id, tekst, tekstCorrect) {
    this.teller +=1;
    if (this.idVanAangepasteZin===id) {
      // alert ('1) tekst: ' + tekst +  '---' + tekstCorrect);
      this.handleUpdateTekst(id, tekst, tekstCorrect);
      this.info ='id: (' + id + ') Wijziging ';
      // alert ('3) this.dataOpgeslagen: ' + this.dataOpgeslagen);
    }

    this.idVanAangepasteZin = 0;
    this.teller = 0;
  }

  onchangeZoekTekst(){
    alert('zoektekst aangeroepen');
  }
}
