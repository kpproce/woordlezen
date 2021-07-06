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
  startDate = new Date();

  tijdVerstreken: number ;

  zinnenIndex = 0;
  actualZin =  '';

  constructor(private dataService: DataService) {}

  ngOnInit() {

    this.dataService.getLocalData().subscribe(data => {
      this.songs=data;
      this.songs2=JSON.parse(JSON.stringify(data));
      console.log('Local data:');
      console.log(this.songs);
      console.log('Local data (stringyfied and parsed):');
      console.log(this.songs);
    });

    this.dataService.getRemoteData().subscribe(remoteData => {
      console.log('Remote data:');
      console.log(remoteData);
      this.weather = remoteData;
    });

    this.dataService. getRemoteDataZinnen().subscribe(data => {
      this.zinnen=data;
      this.zinnen2=JSON.parse(JSON.stringify(data))
      console.log('remote data zinnen:');
      console.log(this.zinnen);
      console.log('Remote data zinnen (stringyfied and parsed):');
      console.log(this.zinnen2);
      this.actualZin = this.zinnen2[this.zinnenIndex].tekst;
    });
  }

  hoelang(){
    // doel van deze functie is om de tijd in sec te berekenen vanaf start van de app.
    this.tijdVerstreken= (Math.floor((Date.now().valueOf() - this.startDate.valueOf())/100)/10);
    this.startDate = new Date();
  }

  mapData(){
    this.songs2 = this.songs2.map((myItem) => myItem);
    console.log(this.songs2);
  }

  mapData2(){
    this.songs2 = this.songs2.map((myItem) => myItem);
  }

  nextZin(){
    this.zinnenIndex ++;
    if (this.zinnenIndex > this.zinnen2.length) {
      this.zinnenIndex = 0;
    }
    this.hoelang();

    this.actualZin = this.zinnen2[this.zinnenIndex].tekst;
  }

}
