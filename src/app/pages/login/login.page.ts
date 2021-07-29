import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  wwClass='medium login lightRed';
  buttonIngelogdColor='Warning';
  resultFromDataService: any;
  resultFromDataServiceTXT = '-- geen info';
  constructor(public dataService: DataService) { }

  ionViewWillEnter(){
    this.checkLogin() ;
    // alert ('ionView-Will-Enter');
  }

  ngOnInit() {
    this.checkLogin();
  }

  getButtonIngelogdColor() {
    return this.buttonIngelogdColor;
  }

  gotoTab1(){
    // this.navctrl.navigateRoot(["tabs/home"]);
  }

  checkLogin() {
    this.dataService.checkLogin(this.dataService.userName, this.dataService.userWW).subscribe(result => {
      this.resultFromDataService=result;
      // this.resultFromDataServiceTXT = stringify(this.resultFromDataService);
      this.resultFromDataServiceTXT = this.resultFromDataService.message;
      this.dataService.lastEditRights  =  (this.resultFromDataService.inlogOK);
      if ( this.dataService.getLastEditRights()) {
        this.wwClass='medium login lightGreen';
        this.buttonIngelogdColor='success';
        // alert('Je hebt wel een goede inlog: ' + this.buttonIngelogdColor);
      } else {
        this.wwClass='medium login lightRed';
        this.buttonIngelogdColor='Warning';
        // alert('Je hebt GEEN goede inlog: '+ this.buttonIngelogdColor);
      }
      // alert ('ingelogd: ' + this.dataService.lastEditRights);
    });

  }

  test() {
    alert('test');
  }

}
