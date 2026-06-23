import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FilterOptions } from '../filter/filter.component';
import { DataBusService } from '../services/data-bus.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  public picktime: string = '';
  public droptime: string = '';
  public pickplace: string = '';
  public dropplace: string = '';
  public pickdate: string = '';
  public dropdate: string = '';

  public dataset: string[] = [];

  @ViewChild('carlists') footer: any = null;

  public carTypes: string[] = [];
  public passengerNum: number = 10;
  public priceMax: number = 10000;
  public priceMin: number = 0;
  public ifAdult: boolean = false;

  constructor(
    private dataBus: DataBusService,
    private routerIonfo: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadSearchParams();
    this.dataBus.setSearchCondi(this.dataset);
  }

  ngAfterViewInit() {
    this.loadSearchParams();
    this.dataBus.setSearchCondi(this.dataset);

    if (!this.pickplace || this.pickplace.trim() === '') {
      this.runAll();
    } else {
      this.run(this.pickplace);
    }
  }

  private loadSearchParams() {
    this.picktime = this.routerIonfo.snapshot.queryParams['pickup_time'] || '';
    this.droptime = this.routerIonfo.snapshot.queryParams['dropoff_time'] || '';
    this.pickplace = this.routerIonfo.snapshot.queryParams['pickup_place'] || '';
    this.dropplace = this.routerIonfo.snapshot.queryParams['dropoff_place'] || '';
    this.pickdate = this.routerIonfo.snapshot.queryParams['pickup_date'] || '';
    this.dropdate = this.routerIonfo.snapshot.queryParams['dropoff_date'] || '';

    if (this.pickplace) {
      this.pickplace = this.pickplace.trim();
    }

    if (!this.dropplace || this.dropplace.trim() === '') {
      this.dropplace = this.pickplace;
    } else {
      this.dropplace = this.dropplace.trim();
    }

    this.dataset = [
      this.pickplace,
      this.dropplace,
      this.pickdate,
      this.picktime,
      this.dropdate,
      this.droptime
    ];
  }

  run(pickplace: string) {
    if (this.footer) {
      this.footer.footerRunLoc(pickplace);
    }
  }

  runAll() {
    if (this.footer) {
      this.footer.footerRunAll();
    }
  }

  runFilter(newoptions: NewFilterOptions) {
    if (this.footer) {
      this.footer.footerRunFilter(newoptions);
    }
  }

  runParent(msg: string[]) {
    this.pickplace = msg[0] || '';
    this.dropplace = msg[1] || '';
    this.pickdate = msg[2] || '';
    this.picktime = msg[3] || '';
    this.dropdate = msg[4] || '';
    this.droptime = msg[5] || '';

    if (this.pickplace) {
      this.pickplace = this.pickplace.trim();
    }

    if (!this.dropplace || this.dropplace.trim() === '') {
      this.dropplace = this.pickplace;
    } else {
      this.dropplace = this.dropplace.trim();
    }

    this.dataset = [
      this.pickplace,
      this.dropplace,
      this.pickdate,
      this.picktime,
      this.dropdate,
      this.droptime
    ];

    this.dataBus.setSearchCondi(this.dataset);

    if (!this.pickplace || this.pickplace === '') {
      this.runAll();
    } else {
      this.run(this.pickplace);
    }
  }

  getFilter(options: FilterOptions) {
    this.carTypes = options.carType;
    this.passengerNum = options.pasgerNum_max;
    this.priceMax = options.price_max;
    this.priceMin = options.price_min;
    this.ifAdult = options.isAdult;

    if (!this.carTypes || typeof this.carTypes[0] === 'undefined') {
      this.carTypes = ['NoCarTypes'];
    }

    if (!this.pickplace || this.pickplace === '') {
      this.pickplace = 'AllTypes';
    }

    var newOptions = new NewFilterOptions(
      this.pickplace,
      this.priceMax,
      this.priceMin,
      this.carTypes,
      this.passengerNum,
      this.ifAdult
    );

    this.runFilter(newOptions);
  }
}

export class NewFilterOptions {
  constructor(
    public pickLocation: string,
    public priceMax: number,
    public priceMin: number,
    public carType: string[],
    public passengerNumMax: number,
    public ifAdult: boolean
  ) { }
}