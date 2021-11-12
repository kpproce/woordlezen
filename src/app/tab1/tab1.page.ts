import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { ModalPopupPage } from '../modal-popup/modal-popup.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  moetFoutenInZinMaken = 50; // 0 is geen fouten en 100 is in alle zinnen een fout maken
  foutInZinGecreeerd = '';
  voorkeurFouten =  [
    {l: 'f', cb1:'v' , cb2: 'l', cb3:'ff'},
    {l: 't', cb1:'l' , cb2: 'd'},
    {l: 'au', cb1:'ou' , cb2: 'ua'},
    {l: 'ou', cb1:'au' , cb2: 'uo'},
    {l: 'ui', cb1:'iu' , cb2: 'eu'},
    {l: 'eu', cb1:'ue' , cb2: 'ui'},
    {l: 'ij', cb1:'ei' , cb2: 'ji'},
    {l: 'll', cb1:'l' , cb2: 'i'},
    {l: 'aa', cb1:'a' , cb2: 'oa'},
    {l: 's', cb1:'ss' , cb2: 'z'},
    {l: 'a', cb1:'e' , cb2: 'o', cb3: 'u'},
    {l: 'e', cb1:'3' , cb2: 'u', cb3: 'a', cb4: 'ee'},
    {l: 'ee', cb1:'ea' , cb2: 'e'}
  ];

  voorkeurFouten2 = [
    ['f', 'v', 'l', 'ff'],
    ['v', 'f', 'u'],
    ['t', 'l', 'd', 'tt'],
    ['au', 'ou', 'eu', 'ua'],
    ['ou', 'au', 'uo', 'ua'],
    ['ij', 'ji', 'ei'],
    ['ll', 'l', 'i'],
    ['aa', 'a', 'ao','ae'],
    ['ss', 's', 'zz'],
    ['s', 'ss', 'z'],
    ['e', '3', 'ee'],
    ['ee', 'ea', 'e'],
  ];

  modelData: any;
  zinnen2;
  aantalZinnen = 0;
  aantalZinnenOver = 0;
  startDateZin = new Date();
  startDateMeerdereZinnen = new Date();
  pauze = false;

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
  tussenTijdMeerdereZinnen = {
    aantalZinnen: 0,
    tussenTijd: 0,
    aantalGoed: 0
  };
  timeIntervalZin; // 1 zin
  timerIntervalMeerdereZinnen; // meerdere zinnen bijv duur van een test
  startMomentZin = new Date();
  startMomentMeerdereZinnen = new Date();

  maxTijd = 20;
  warningTijd = 5;
  warningTijd2 = 8;
  duurFactor = 0;

  info = '';

  snelheid = 'langzaam'; // slak, langzaam, normaal, snel, jaguar
  nivo = ['1','2'];
  containsLetterGroups = ['all'];
  containsText = '';
  zinStyle = 'rgb(10, 10, 10)';
  wwClass='small login lightRed';
  buttonIngelogdColor = 'warning';

  geraden = [];

  resultFromDataService: any;
  resultFromDataServiceTXT = '-- geen info';

  constructor(private dataService: DataService, public modalController: ModalController) {}

  ionViewWillEnter(){
    this.checkLogin();
    this.onchangeSnelheid();
    // alert ('ionView-Will-Enter');
  }

  async openIonModal() {
    const modal = await this.modalController.create({
      component: ModalPopupPage,
      componentProps: {
        modelTitle: 'Nomadic models reveberation',
        zinWeergevenText: this.actualZin,
        zinCorrectText: this.actualZinCorrect,
        zinId: this.zinId
      }
    });

    modal.onDidDismiss().then((modelData) => {
      if (modelData !== null) {
        // this.modelData = modelData.data.zinWeergevenText;
        console.log('Nieuwe weergeven tekst: ' + modelData.data.zinWeergevenText );
        console.log('Nieuwe correcte tekst: ' + modelData.data.zinCorrectText );
        this.actualZin = modelData.data.zinWeergevenText;
        this.actualZinCorrect = modelData.data.zinCorrectText;
        this.resetTijdZin();
      }
    });

    return await modal.present();
  }

  ngOnInit() {
   this.checkLogin() ;
   this.getZinnen();
  }

    onchangeSnelheid(){
      // alert(this.snelheid);
      // nivo 1 = *  0,8      // nivo 2 = *  1      // nivo 3 = *  1,2      // nivo 4 = *  1,4
      if (this.snelheid==='slak')     { this.warningTijd = 20;    this.warningTijd2 = 22; this.maxTijd = 25; }
      if (this.snelheid==='langzaam') { this.warningTijd = 15;    this.warningTijd2 = 17; this.maxTijd = 20;}
      if (this.snelheid==='normaal')  {  this.warningTijd = 10;    this.warningTijd2 = 12;  this.maxTijd = 15; }
      if (this.snelheid==='snel')     { this.warningTijd = 5;     this.warningTijd2 = 7;  this.maxTijd = 10; }
      if (this.snelheid==='jaguar')   {  this.warningTijd = 0.5;  this.warningTijd2 = 1;  this.maxTijd = 2; }
      this.getZinnen();
    }

    getZinnen() { // ******************** RELOAD ***************
      const nivo = '(' + this.nivo + ')';
      const containsLetterGroups1 = '(' + this.containsLetterGroups + ')';
      // alert('test');
      /* voorbeeld  getDataZinnen(userName: string, userWW: string, deleted: string, nivoMulti: string,
      containsLetterGroups: string, containsText: string, containsTextStart: boolean, maxAantal: number,
      eersteZinID: number, order: string)
      */
     this.dataService.getDataZinnen(this.dataService.userName, this.dataService.userWW,
        'nee', nivo, containsLetterGroups1, this.containsText, false, 20, -1, 'random').subscribe(data => {

        this.zinnen2=JSON.parse(JSON.stringify(data));
        this.aantalZinnen = this.zinnen2.length;
        this.aantalZinnenOver =  this.zinnen2.length;

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
        this.tussenTijdMeerdereZinnen.aantalZinnen= 0;
        this.tussenTijdMeerdereZinnen.tussenTijd= 0;
        this.tussenTijdMeerdereZinnen.aantalGoed= 0;
        this.pauze=false;
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
        if (this.verstrekenZin > (this.warningTijd * this.duurFactor)){
          this.zinStyle = 'rgb(236, 230, 228)';
        };
        if (this.verstrekenZin  > (this.warningTijd2 * this.duurFactor) ){
          this.zinStyle = 'rgb(250, 170, 170)';
        };
        if (this.verstrekenZin >= this.maxTijd || this.pauze){
          this.verstrekenZin = this.maxTijd;
          this.zinStyle = 'rgb(250, 1, 1)';
          // backgroud 245, 244, 237
        }
      }.bind(this),1000);
    }
  }

  startTijdMetingMeerdereZinnen() { // meerdere zinnen bijv een test
    this.timerIntervalMeerdereZinnen = setInterval(function() {
      if (!this.pauze) {
        this.verstrekenMeerdereZinnen = (Math.floor(( new Date().valueOf() - this.startMomentMeerdereZinnen.valueOf())/1000));
      }
    }.bind(this),400);

  }

  beoordeelZin(goed: boolean) {
    if ( this.actualZin===this.actualZinCorrect) {
      this.zinGelijk = true;

      if (goed) {
        this.zinGeradenTekst = 'CORRECT de zin was goed';
        this.zinGeraden = true;
        this.zinBkColor = 'LightGreen'; //goed
      }
      else {
        this.zinGeradenTekst = 'ZIN was GOED';
        this.zinGeraden = false;
        this.zinBkColor = 'DarkSalmon'; //fout
      }

    } else { // de zinnen waren ongelijk en dus is een foute aangeboden
      this.zinGelijk = false;

      if (goed) { // jij dacht goed, maar het was fout
        this.zinGeradenTekst = 'ZIN was FOUT';
        this.zinGeraden = false;
        this.zinBkColor = 'DarkSalmon'; //fout
      }
      else { // zin ongelijk en dat dacgt jij ook
        this.zinGeradenTekst = 'CORRECT de zin was FOUT';
        this.zinGeraden = true;
        this.zinBkColor = 'LightGreen'; //goed
      }
    }
  }

  verwerkTijd(){  // ******************** TOEVOEGEN AAN geraden LIJST ********************
    this.tussenTijdMeerdereZinnen.tussenTijd=this.verstrekenMeerdereZinnen;
    this.geraden.unshift({zin: this.actualZin, correct: this.actualZinCorrect,
      tijd: this.verstrekenZin, geraden: this.zinGeraden, gelijk: this.zinGelijk,
      geradenTekst: this.zinGeradenTekst, zinBkColor: this.zinBkColor, id: this.zinId});
    this.tussenTijdMeerdereZinnen.aantalZinnen=this.geraden.length;
    // alert(this.actualZin + ' ' + this.verstreken + ' ' + this.geraden[0].tekst);
    // alert ('VOOR  verwerktijd aangeroepen: ' + this.tussenTijdMeerdereZinnen.aantalZinnen + ' correct: ' + this.actualZinCorrect);
    if (this.actualZinCorrect) { this.tussenTijdMeerdereZinnen.aantalZinnen += 1; };
    // alert (' verwerktijd aangeroepen: ' + this.tussenTijdMeerdereZinnen.aantalZinnen + ' correct: ' + this.actualZinCorrect);
  }

  aantalGoed() {
    let aantal= 0;
    this.geraden.forEach((item, index) => {
      if (item.geraden) {aantal +=1;}
      // alert(item.zin + ' geraden:' + item.geraden + ' aantal:' + aantal);
    });
    return aantal;

  }

  resetTijdZin(){
    this.startMomentZin= new Date();
    // this.tijdVerstreken= (Math.floor((Date.now().valueOf() - this.startDate.valueOf())/100)/10);
    this.startDateZin = new Date();
    this.zinStyle =  'Black';
    // alert('resetTijd voor 1 zin aangeroepen');
  }

  resetTijdMeerdereZinnen(){
    this.startMomentMeerdereZinnen= new Date();
    // this.tijdVerstreken= (Math.floor((Date.now().valueOf() - this.startDate.valueOf())/100)/10);
    this.startDateMeerdereZinnen = new Date();
    this.resetTijdZin();
    this.zinStyle =  'Black';

    // alert('resetTijd meerdere zinnen aangeroepen');
  }

  hoelangZin(){
    // doel van deze functie is om de tijd in sec te berekenen vanaf start van de app.
    this.startMomentZin = new Date();
    // this.tijdVerstreken= (Math.floor((Date.now().valueOf() - this.startDate.valueOf())/100)/10);
    this.startDateZin = new Date();
    // this.addNewScoreToDatabaseApi(); // niet handig, beter uitdenken
  }

  zoekSubstringInVoorkeurFouten(substring: string) {
    // return een index. -1 is niet gevonden
   let gevondenIndex = -1;
    let text='';
    this.voorkeurFouten.forEach((element,i) => {
      gevondenIndex = element.l.indexOf(substring);
      // deze routine vindt de laatste
      text+= 'zoek: ' +   this.actualZin + ' letter:' + substring + ' -- vergelijk met: '
          + element.l + ' -- gevondenIndex: ' + gevondenIndex + '\n';
    });
    // alert (text);
    return gevondenIndex;
  }

  geefVervangendeLetter(i: number) {
    // gebruikt classmember:  voorkeurFouten =  [
    // zoek l en vervang met cb1, cb2 of cb3, kies random, er kunnen meer zijn
    // voor test vervang met eerste
    const gekozen =  Math.floor(Math.random() *this.voorkeurFouten2[i].length);
    // alert ('max: ${max} fouten: ${this.voorkeurFouten2[i].toString}');
    // alert (this.voorkeurFouten2[i][0] + ' -- ' + gekozen + ' -- ' + this.voorkeurFouten2[i][gekozen] );
    return this.voorkeurFouten2[i][gekozen];
  }

maakFoutInZin(goedeZin: string) {
    // gebruikt classmember:  voorkeurFouten =  [ {l: 'a', cb1:'e' , cb2: 'o', cb3: 'u'},
    // zoek of een letter voorkomt en vervang die.
    let teller=-1;
    let gevondenIndex = -1;
    let teVervangenText: any;
    let nieuweText: any;
    let stop = false;
    let info = '';
    // alert('test: ' + goedeZin + ' eerste zoekletter: '+ this.voorkeurFouten[teller+1].l) ;
    // alert ('check op letters: ' + this.voorkeurFouten.map(item =>  item.l ) );
    while (!stop) {
      teller += 1;
      //alert (teller);
      try {
        gevondenIndex = (goedeZin.indexOf(this.voorkeurFouten2[teller][0]));
        info += ('voorkeurFouten[' + teller + ']: ' + this.voorkeurFouten2[teller][0] +  ' --gevonden in soord op pos:' + gevondenIndex);
        // alert ('voorkeurfouten lengte: ' + this.voorkeurFouten.length + ' zin: ' + goedeZin + ' gevondenIndex: ' + gevondenIndex
        //   + ' -- teller: ' + teller + '--' + this.voorkeurFouten[teller].l);
        stop = (gevondenIndex>=0 || teller >= this.voorkeurFouten2.length-1);
      }
        catch (error){
          stop=true;
      }

      // alert (goedeZin +' fouteDeelteks:' + teller + ' zoek naar:' + this.voorkeurFouten[teller].l + ' gevonden op:' + gevondenIndex);
    }
    // als gevondenIndex -1 dan letter combi uit voorkeurfouten niet gevonden, anders wel.
    //alert(info);

    if (gevondenIndex>=0) {
      teVervangenText = this.voorkeurFouten2[teller][0];
      nieuweText = this.geefVervangendeLetter(teller);
      const lo =  teVervangenText.length;
      this.foutInZinGecreeerd += teVervangenText + '/' + nieuweText;
      const ln =  nieuweText.length;
      // alert ( goedeZin.substr(0,gevondenIndex) + nieuweText + goedeZin.substr(gevondenIndex+lo, goedeZin.length-ln));
      // alert ( goedeZin +  ' index:' + gevondenIndex + ' :  ' + goedeZin.substr(0,gevondenIndex) );
      return  goedeZin.substr(0,gevondenIndex) + nieuweText + goedeZin.substr(gevondenIndex+lo, goedeZin.length-lo);
      alert ('gevondenIndex -'+ gevondenIndex  + '- groter gelijk aan 0' );
    //
    // return (goedeZin.substr(0,teller) + this.geefVervangendeLetter(gevondenIndex) +goedeZin.substr(teller+1, goedeZin.length-teller-1));
    } else {
      // alert ( goedeZin +  ' index:' + gevondenIndex + ' :  ' + goedeZin.substr(0,gevondenIndex) );
      // alert ('gevondenIndex < 0' );
      return (goedeZin);
    }
  }

  nextZin(goed: boolean){
    this.beoordeelZin(goed);

    if (this.aantalZinnen>0) {
      // this.zinnenIndex ++;
      if (this.zinnenIndex > this.zinnen2.length) {
        this.zinnenIndex = 0;
        // alert ('aantal; zinnen: ' + this.zinnen2.length + ' ' + this.zinnenIndex);
      }
      this.hoelangZin();
      this.verwerkTijd();

      this.zinnen2.splice(0, 1);  // verwijder de eerste regel, zodat dezelfde niet nog een keer gevraagd wordt.
      if (this.zinnen2.length<1) {
        this.actualZin = 'alle zinnen gehad, klik Nieuwe zinnen';
        // stop de tijd
        // clearInterval(this.timeIntervalZin);
        // clearInterval(this.timerIntervalMeerdereZinnen);
        this.pauze=true;
        alert((this.tussenTijdMeerdereZinnen.aantalZinnen-1) +
        ' zinnen in ' + this.tussenTijdMeerdereZinnen.tussenTijd + ' sec, ' +
        this.aantalGoed() + ' GOED!');
      } else {
        this.pauze = false;
        this.zinStyle = 'rgb(10, 10, 10)';

        // origineel V1
        // this.actualZin = this.zinnen2[this.zinnenIndex].tekst;
        // alert (this.maakFoutInZin(this.actualZin));
        // this.actualZinCorrect = this.zinnen2[this.zinnenIndex].tekstCorrect;
        // met automatische foutmaker..

        this.actualZinCorrect = this.zinnen2[this.zinnenIndex].tekstCorrect;
        const rnd = Math.floor(Math.random()*100);
        // alert (rnd);
        this.foutInZinGecreeerd= '';
        if (rnd < this.moetFoutenInZinMaken) {
          this.actualZin = this.maakFoutInZin(this.actualZinCorrect);
        } else {
          this.actualZin = this.actualZinCorrect;
        }
        this.actualNivo = this.zinnen2[this.zinnenIndex].nivo - 0 ;
        this.duurFactor = 1 + (this.actualNivo -2 )/5;
      }
    }
    else {
      this.actualZin = 'geen data gevonden checkdata connectie';
    }
  }

  getZinSize(actualZin){
   if (actualZin.length < 14 || this.actualNivo<2) {
      return 'xxx-large';
    } else {
      if (actualZin.length > 45 ) {return 'x-large';} else {return 'xx-large';}
    }
    // return 'xx-large';
  }

  getZinTekstColor() {
    if (this.zinGelijk )
      {return 'color:black; background-color: lightgreen;';}
    else
      {return 'color:white; background-color: red;';}
  }

  getGeradenZinBkColor() { // niet in gebruik??
    if (this.zinGelijk )
      {return 'Orange';}
    else
      {return 'Yellow';}
  }

  test() {
    alert('test uitgevoerd');
   }

}
