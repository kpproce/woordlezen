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

  actualZin = 'geen data gevonden checkdata connectie';

  constructor(private dataService: DataService) {}
  ngOnInit() {

    this.dataService.getRemoteDataZinnen().subscribe(data => {
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

}
