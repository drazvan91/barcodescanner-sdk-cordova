import { Component, ViewChild } from '@angular/core';
import { Content, NavController } from 'ionic-angular';

import { ScannerServiceProvider } from '../../providers/scanner-service/scanner-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements ScannerDelegate {
  public barcodes: Barcode[] = [];
  public continuousMode: boolean = false;

  @ViewChild(Content) private content: Content;

  constructor(
    public navCtrl: NavController,
    public scanner: ScannerServiceProvider,
  ) {

  }

  public ionViewDidEnter(): void {
    this.scanner.contentTop = this.content.contentTop;
    this.scanner.delegate = this;
    this.scanner.start();
  }

  public didScan(session: ScanSession) {
    if (!this.continuousMode) {
      session.pauseScanning();
    }
    this.barcodes = session.newlyRecognizedCodes;
  }

  public resumeScanning() {
    this.scanner.resume();
    this.barcodes = [];
  }

  public toggleContinuousMode() {
    this.continuousMode = !this.continuousMode;
    this.scanner.resume();
  }
}
