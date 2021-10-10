import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-modal-popup',
  templateUrl: './modal-popup.page.html',
  styleUrls: ['./modal-popup.page.scss'],
})

export class ModalPopupPage implements OnInit {
  @Input() modelTitle: string;
  @Input() zinWeergevenText: string;
  @Input() zinCorrectText: string;
  @Input() zinId: string;
  zinCorrectTextChanged: string;
  zinWeergevenTextChanged: string;
  resultFromDataService: any;
  resultFromDataServiceTXT = 'geen update info';
  info= '---';

  constructor(
    private modalController: ModalController,
    private dataService: DataService
  ) { }

  ngOnInit(
  ) {
    this.zinWeergevenTextChanged = this.zinWeergevenText;
    this.zinCorrectTextChanged = this.zinCorrectText;
  }

  handleUpdateChangedTekst(){

    this.dataService.updateDataTekst(this.dataService.userName, this.dataService.userWW,
        this.zinId, this.zinCorrectTextChanged, this.zinWeergevenTextChanged).subscribe(result => {
        this.resultFromDataService=result;
      // this.resultFromDataServiceTXT = stringify(this.resultFromDataService);
      this.resultFromDataServiceTXT = JSON.stringify(result);
      const result2= JSON.parse(this.resultFromDataServiceTXT);
      this.dataService.lastEditRights  = result2.ingelogd; // dit moet cleaner..
      if (result2.ingelogd) {
        this.info = this.info +  ' opgeslagen ';
      } else {
        this.info = this.info +  ' NIET opgeslagen ';
      }
      //alert('Ingelogd: '+ result2.ingelogd + ' -- ' + result2.message);
    });
  }

  async closeAndSaveModal() {
    const close = 'modal screen closed';
    /* alert(  'text weergeven: ' + weegevenTextPassBack +
          '\ntext correct:   ' + correctTextPassBack + '\ndoorgegeven: ' ); */

    const dataTerug = {
      zinWeergevenText: this.zinWeergevenTextChanged,
      zinCorrectText: this.zinCorrectTextChanged
    };
    this.handleUpdateChangedTekst();
    await this.modalController.dismiss( dataTerug);
  }

  async closeAndCancelModal() {
    const close = 'modal screen closed';
    /* alert(  'text weergeven: ' + weegevenTextPassBack +
          '\ntext correct:   ' + correctTextPassBack + '\ndoorgegeven: ' ); */
    const dataTerug = {
      zinWeergevenText: this.zinWeergevenText,
      zinCorrectText: this.zinCorrectText
    };
    await this.modalController.dismiss( dataTerug);
  }

}
