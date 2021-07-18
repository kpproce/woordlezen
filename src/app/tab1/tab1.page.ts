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
  actualZin = 'geen data gevonden checkdata connectie';

  nu = new Date();
  verstreken = 0;
  intervalVar;
  startMoment = new Date();
  maxTijd = 30;

  geraden = [];

  resultFromDataService: any;
  resultFromDataServiceTXT = '-- geen info';

  constructor(private dataService: DataService) {}

  ngOnInit() {

    this.dataService.getDataZinnen('nee').subscribe(data => {
      this.zinnen=data;
      this.zinnen2=JSON.parse(JSON.stringify(data));
      this.aantalZinnen = this.zinnen2.length;

      console.log('remote data zinnen:');
      console.log(this.zinnen);
      console.log('Remote data zinnen (stringyfied and parsed):');
      console.log(this.zinnen2);
      this.actualZin = this.zinnen2[this.zinnenIndex].tekst;
      this.startTime();
    });
  }

    addNewScoreToDatabaseApi() {
      //saveNewZin() {
        this.dataService.insertScore('Rien', 'Wilma61', this.zinnen2[this.zinnenIndex].id, this.verstreken).subscribe(result => {
          this.resultFromDataService=result;
          // this.resultFromDataServiceTXT = stringify(this.resultFromDataService);
          this.resultFromDataServiceTXT = ' score opgeslagen';
        });
    }


  startTime() {
    if (this.aantalZinnen>0) {
      this.intervalVar = setInterval(function() {
        this.verstreken = (Math.floor(( new Date().valueOf() - this.startMoment.valueOf())/100)/10);
        if (this.verstreken > this.maxTijd){
          this.verstreken = 0;
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

  nextZin(){
    if (this.aantalZinnen>0) {
      this.zinnenIndex ++;
      if (this.zinnenIndex > this.zinnen2.length) {
        this.zinnenIndex = 0;
      }
      this.hoelang();
      this.verwerkTijd();
      this.actualZin = this.zinnen2[this.zinnenIndex].tekst;
    }
    else {
      this.actualZin = 'geen data gevonden checkdata connectie';
    }
  }

}
