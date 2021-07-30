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
  startDateZin = new Date();
  startDateMeerdereZinnen = new Date();

  tijdVerstreken: number ;

  zinnenIndex = 0;
  actualZin = 'geen data gevonden check data connectie';
  zinId = 0;
  actualZinCorrect= 'onbekend';
  zinGelijk = false;
  zinGeraden = false;
  zinBkColor = 'white';
  zinGeradenTekst = 'nog niets geraden';

  actualNivo =-1;

  nu = new Date();
  verstrekenZin = 0;
  verstrekenMeerdereZinnen = 0;
  timeIntervalZin; // 1 zin
  timerIntervalMeerdereZinnen; // meerdere zinnen bijv duur van een test
  startMomentZin = new Date();
  startMomentMeerdereZinnen = new Date();

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
    this.onchangeSnelheid();
    // alert ('ionView-Will-Enter');
  }

  ngOnInit() {
   this.checkLogin() ;
   this.getZinnen();
  }
    onchangeSnelheid(){
      // alert(this.snelheid);
      // nivo 1 = *  0,8      // nivo 2 = *  1      // nivo 3 = *  1,2      // nivo 4 = *  1,4
      if (this.snelheid==='slak')     { this.warningTijd = 15;    this.warningTijd2 = 17; this.maxTijd = 20; }
      if (this.snelheid==='langzaam') { this.warningTijd = 10;    this.warningTijd2 = 14; this.maxTijd = 17;}
      if (this.snelheid==='normaal')  {  this.warningTijd = 5;    this.warningTijd2 = 8;  this.maxTijd = 10; }
      if (this.snelheid==='snel')     { this.warningTijd = 3;     this.warningTijd2 = 5;  this.maxTijd = 8; }
      if (this.snelheid==='jaguar')   {  this.warningTijd = 0.5;  this.warningTijd2 = 1;  this.maxTijd = 2; }
    }

    getZinnen() { // ******************** RELOAD ***************
      const n = '(' + this.nivo + ')';
      // alert('test');
      this.dataService.getDataZinnen(this.dataService.userName, this.dataService.userWW, 'nee', n, 'random').subscribe(data => {
        this.zinnen=data;
        this.zinnen2=JSON.parse(JSON.stringify(data));
        this.aantalZinnen = this.zinnen2.length;

        this.actualZin = this.zinnen2[this.zinnenIndex].tekst;
        this.zinId = this.zinnen2[this.zinnenIndex].id;

        this.actualZinCorrect = this.zinnen2[this.zinnenIndex].tekstCorrect;
        this.actualNivo = this.zinnen2[this.zinnenIndex].nivo - 0 ;
        //alert( this.actualNivo + ' type: ' + typeof this.actualNivo + '  ' + this.warningTijd2 + ' type: ' + typeof this.warningTijd2 );
        this.resetTijdZin();
        this.resetTijdMeerdereZinnen();
        this.startTijdMetingZin();
        this.startTijdMetingMeerdereZinnen();
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

    addNewScoreToDatabaseApi() { // niet in gebruik
      //saveNewZin() {
       /*  this.dataService.insertScore('Rien', 'Wilma61', this.zinnen2[this.zinnenIndex].id, this.verstreken).subscribe(result => {
          this.resultFromDataService=result;
          // this.resultFromDataServiceTXT = stringify(this.resultFromDataService);
          this.resultFromDataServiceTXT = ' score opgeslagen';

        }); */
    }

  startTijdMetingZin() {
    if (this.aantalZinnen>0) {
      this.timeIntervalZin = setInterval(function() {
        this.verstrekenZin = (Math.floor(( new Date().valueOf() - this. startMomentZin.valueOf())/100)/10);
        this.duurFactor = 1 + (this.actualNivo -2 )/5;
        if (this.verstrekenZin > (this.warningTijd * this. duurFactor)){
          this.zinStyle = 'rgb(236, 230, 228)';
        };
        if (this.verstrekenZin  > (this.warningTijd2 * this. duurFactor) ){
          this.zinStyle = 'rgb(250, 170, 170)';
        };
        if (this.verstrekenZin >= this.maxTijd){
          this.verstrekenZin = this.maxTijd;
          this.zinStyle = 'rgb(250, 1, 1)';
          // backgroud 245, 244, 237
        }
      }.bind(this),400);
    }
  }

  startTijdMetingMeerdereZinnen() { // meerdere zinnen bijv een test
    this.timerIntervalMeerdereZinnen = setInterval(function() {
      this.verstrekenMeerdereZinnen = (Math.floor(( new Date().valueOf() - this.startMomentMeerdereZinnen.valueOf())/1000));

    }.bind(this),400);

  }

  beoordeelZin(goed: boolean) {
    if ( this.actualZin===this.actualZinCorrect) {
      this.zinGelijk = true;

      if (goed) {
        this.zinGeradenTekst = 'CORRECT de zin was goed';
        this.zinGeraden = true;
        this.zinBkColor = '#ecffe0'; //goed
      }
      else {
        this.zinGeradenTekst = 'ZIN was wel GOED';
        this.zinGeraden = false;
        this.zinBkColor = '#fcf3f0'; //fout
      }

    } else { // de zinnen waren ongelijk en dus is een foute aangeboden
      this.zinGelijk = false;

      if (goed) { // jij dacht goed, maar het was fout
        this.zinGeradenTekst = 'ZIN was toch FOUT';
        this.zinGeraden = false;
        this.zinBkColor = '#fcf3f0'; //fout
      }
      else { // zin ongelijk en dat dacgt jij ook
        this.zinGeradenTekst = 'CORRECT de zin was FOUT';
        this.zinGeraden = true;
        this.zinBkColor = '#ecffe0'; //goed
      }
    }
  }

  verwerkTijd(){  // ******************** TOEVOEGEN AAN geraden LIJST ********************
    this.geraden.unshift({zin: this.actualZin, correct: this.actualZinCorrect,
      tijd: this.verstrekenZin, geraden: this.zinGeraden, gelijk: this.zinGelijk,
      geradenTekst: this.zinGeradenTekst, zinBkColor: this.zinBkColor, id: this.zinId});
    // alert(this.actualZin + ' ' + this.verstreken + ' ' + this.geraden[0].tekst);
    console.log(this.geraden);
  }

  resetTijdZin(){
    this.startMomentZin= new Date();
    // this.tijdVerstreken= (Math.floor((Date.now().valueOf() - this.startDate.valueOf())/100)/10);
    this.startDateZin = new Date();
    this.zinStyle =  'rgb(10, 10, 10)';
    // alert('resetTijd voor 1 zin aangeroepen');
  }

  resetTijdMeerdereZinnen(){
    this.startMomentMeerdereZinnen= new Date();
    // this.tijdVerstreken= (Math.floor((Date.now().valueOf() - this.startDate.valueOf())/100)/10);
    this.startDateMeerdereZinnen = new Date();
    this.resetTijdZin();
    this.zinStyle =  'rgb(10, 10, 10)';

    // alert('resetTijd meerdere zinnen aangeroepen');
  }

  hoelangZin(){
    // doel van deze functie is om de tijd in sec te berekenen vanaf start van de app.
    this.startMomentZin = new Date();
    // this.tijdVerstreken= (Math.floor((Date.now().valueOf() - this.startDate.valueOf())/100)/10);
    this.startDateZin = new Date();
    // this.addNewScoreToDatabaseApi(); // niet handig, beter uitdenken
  }

  mapData(){
    this.songs2 = this.songs2.map((myItem) => myItem);
    console.log(this.songs2);
  }

  mapData2(){
    this.songs2 = this.songs2.map((myItem) => myItem);
  }

  nextZin(goed: boolean){
    this.beoordeelZin(goed);
    if (this.aantalZinnen>0) {
      this.zinnenIndex ++;
      if (this.zinnenIndex > this.zinnen2.length) {
        this.zinnenIndex = 0;
      }
      this.hoelangZin();
      this.verwerkTijd();
      this.zinStyle = 'rgb(10, 10, 10)';
      this.actualZin = this.zinnen2[this.zinnenIndex].tekst;
      this.actualZinCorrect = this.zinnen2[this.zinnenIndex].tekstCorrect;
      this.actualNivo = this.zinnen2[this.zinnenIndex].nivo - 0 ;
      this.duurFactor = 1 + (this.actualNivo -2 )/5;
    }
    else {
      this.actualZin = 'geen data gevonden checkdata connectie';
    }

  }

  getZinTekstColor() {
    if (this.zinGelijk )
      {return 'color:black; background-color: lightgreen;';}
    else
      {return 'color:white; background-color: red;';}
  }

  getGeradenZinBkColor() {
    if (this.zinGelijk )
      {return 'orange';}
    else
      {return 'yellow';}
  }


}
