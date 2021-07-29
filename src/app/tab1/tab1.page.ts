import { Component } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  songs: any;
  songs2 ;
  weather ;
  zinnen;
  zinnen2;
  aantalZinnen = 0;
  startDate = new Date();

  tijdVerstreken: number ;

  zinnenIndex = 0;
  actualZin = 'geen data gevonden check data connectie';
  actualZinCorrect = '';

  geradenTekst = 'nog niets geraden';
  actualNivo =-1;

  nu = new Date();
  verstreken = 0;
  intervalVar;
  startMoment = new Date();
  maxTijd = 20;
  warningTijd = 5;
  warningTijd2 = 8;
  duurFactor = 0;

  info = '';

  snelheid = 'normaal'; // slak, langzaam, normaal, snel, jaguar
  nivo = ['1','2','3','4'];
  zinStyle = 'rgb(10, 10, 10)';
  wwClass='small login lightRed';
  buttonIngelogdColor = 'warning';

  geraden = [];

  resultFromDataService: any;
  resultFromDataServiceTXT = '-- geen info';

  constructor(private dataService: DataService) {}


  ionViewWillEnter(){
    this.checkLogin();
    // alert ('ionView-Will-Enter');
  }

  ngOnInit() {
   this.checkLogin() ;
   this.getZinnen();
  }
    onchangeSnelheid(){
      // alert(this.snelheid);
      // nivo 1 = *  0,8      // nivo 2 = *  1      // nivo 3 = *  1,2      // nivo 4 = *  1,4
      if (this.snelheid==='slak') { this.warningTijd = 10; this.warningTijd2 = 14; this.maxTijd = 20; }
      if (this.snelheid==='langzaam') { this.warningTijd = 7; this.warningTijd2 = 11;  this.maxTijd = 15;}
      if (this.snelheid==='normaal') {  this.warningTijd = 5; this.warningTijd2 = 8; this.maxTijd = 12; }
      if (this.snelheid==='snel') {  this.warningTijd = 3; this.warningTijd2 = 5; this.maxTijd = 10; }
      if (this.snelheid==='jaguar') {  this.warningTijd = 0.5; this.warningTijd2 = 1; this.maxTijd = 3; }
    }

    getZinnen() {
      const n = '(' + this.nivo + ')';
      // alert('test');
      this.dataService.getDataZinnen(this.dataService.userName, this.dataService.userWW, 'nee', n, 'random').subscribe(data => {
        this.zinnen=data;
        this.zinnen2=JSON.parse(JSON.stringify(data));
        this.aantalZinnen = this.zinnen2.length;

        this.actualZin = this.zinnen2[this.zinnenIndex].tekst;
        this.actualZinCorrect = this.zinnen2[this.zinnenIndex].tekstCorrect;
        this.actualNivo = this.zinnen2[this.zinnenIndex].nivo - 0 ;
        //alert( this.actualNivo + ' type: ' + typeof this.actualNivo + '  ' + this.warningTijd2 + ' type: ' + typeof this.warningTijd2 );
        this.resetTijd();
        this.startTime();
        this.geraden = [];
      });
    }

    checkLogin() {
      this.dataService.checkLogin(this.dataService.userName, this.dataService.userWW).subscribe(result => {
        this.resultFromDataService=result;
        // this.resultFromDataServiceTXT = stringify(this.resultFromDataService);
        this.resultFromDataServiceTXT = this.resultFromDataService.message;
        this.dataService.lastEditRights  =  (this.resultFromDataService.inlogOK);
        if ( this.dataService.getLastEditRights()) {
          this.wwClass='small login lightGreen';
          this.buttonIngelogdColor='success';
          // alert('test1:' + this.wwClass);
        } else {
          this.wwClass='small login lightRed';
          this.buttonIngelogdColor='danger';
          //alert('ingelogd: '+ this.buttonIngelogdColor);
        }
           // alert('test2:'+ this.wwClass);
      });
    }

    addNewScoreToDatabaseApi() {
      //saveNewZin() {
       /*  this.dataService.insertScore('Rien', 'Wilma61', this.zinnen2[this.zinnenIndex].id, this.verstreken).subscribe(result => {
          this.resultFromDataService=result;
          // this.resultFromDataServiceTXT = stringify(this.resultFromDataService);
          this.resultFromDataServiceTXT = ' score opgeslagen';

        }); */
    }

  startTime() {
    if (this.aantalZinnen>0) {
      this.intervalVar = setInterval(function() {
        this.verstreken = (Math.floor(( new Date().valueOf() - this.startMoment.valueOf())/100)/10);
        this.duurFactor = 1 + (this.actualNivo -2 )/5;
        if (this.verstreken > (this.warningTijd * this. duurFactor)){
          this.zinStyle = 'rgb(236, 230, 228)';
        };
        if (this.verstreken  > (this.warningTijd2 * this. duurFactor) ){
          this.zinStyle = 'rgb(255, 250, 250)';
        };
        if (this.verstreken > this.maxTijd){
          this.verstreken = 0;
          this.zinStyle = 'rgb(250, 1, 1)';
          // backgroud 245, 244, 237
        }
      }.bind(this),400);
    }
  }

  verwerkTijd(){
    this.geraden.unshift({zin: this.actualZin, tijd: this.verstreken});
    // alert(this.actualZin + ' ' + this.verstreken + ' ' + this.geraden[0].tekst);
    console.log(this.geraden);
  }

  resetTijd(){
    this.startMoment = new Date();
    this.tijdVerstreken= (Math.floor((Date.now().valueOf() - this.startDate.valueOf())/100)/10);
    this.startDate = new Date();
    this.zinStyle =  'rgb(10, 10, 10)';
  }

  hoelang(){
    // doel van deze functie is om de tijd in sec te berekenen vanaf start van de app.
    this.startMoment = new Date();
    this.tijdVerstreken= (Math.floor((Date.now().valueOf() - this.startDate.valueOf())/100)/10);
    this.startDate = new Date();
    this.addNewScoreToDatabaseApi();
  }

  mapData(){
    this.songs2 = this.songs2.map((myItem) => myItem);
    console.log(this.songs2);
  }

  mapData2(){
    this.songs2 = this.songs2.map((myItem) => myItem);
  }

  nextZin(goed: boolean){
    if (this.aantalZinnen>0) {
      this.zinnenIndex ++;
      if (this.zinnenIndex > this.zinnen2.length) {
        this.zinnenIndex = 0;
      }
      this.hoelang();
      this.verwerkTijd();
      this.zinStyle = 'rgb(10, 10, 10)';
      this.actualZin = this.zinnen2[this.zinnenIndex].tekst;
      this.actualZinCorrect = this.zinnen2[this.zinnenIndex].tekstCorrect;
      if ( this.actualZin===this.actualZinCorrect) {
        this.geradenTekst = 'teksten zijn gelijk, jij dacht: ' + (goed?' dat ook':' van niet');
      } else {
        this.geradenTekst = 'teksten zijn NIET gelijk jij dacht ' + (goed?' van niet':' dat ook');
      }
      this.actualNivo = this.zinnen2[this.zinnenIndex].nivo - 0 ;
      this.duurFactor = 1 + (this.actualNivo -2 )/5;
    }
    else {
      this.actualZin = 'geen data gevonden checkdata connectie';
    }
  }

}
