import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Booking, BookingsService } from '../services/bookings.service';
import { Car } from '../class/car';
import { DataBusService } from '../services/data-bus.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-bookingdetail',
  templateUrl: './bookingdetail.component.html',
  styleUrls: ['./bookingdetail.component.css']
})
export class BookingdetailComponent implements OnInit {

  public driverinfo: driverinfo = {
    firstname: '',
    lastname: '',
    email: '',
    phone: ''
  };

  public price: pricedetail = new pricedetail(
    3,
    26.99,
    5.49,
    8.96,
    6.99,
    48.09,
    0,
    0
  );

  public booking: Booking = new Booking(
    '2018-01-01',
    '2018-01-02',
    '',
    '',
    0,
    '',
    '',
    this.driverinfo
  );

  public car: Car = new Car();
  public searchInfo: string[] = [];

  constructor(
    private bookingservice: BookingsService,
    private router: Router,
    private dataBus: DataBusService,
    private auth: AuthenticationService
  ) {
    this.car = this.dataBus.getCarInfo() || new Car();
    this.searchInfo = this.dataBus.getSearchCondi() || [];

    this.updatePrice();

    this.dataBus.carValueUpdate.subscribe(
      (val) => {
        this.car = this.dataBus.getCarInfo() || new Car();
        this.updatePrice();
      },
      (err) => {
        console.log('Erro ao atualizar dados do veículo.');
      }
    );
  }

  ngOnInit() {
    this.dataBus.carSearchCondiUpdate.subscribe(
      (val) => {
        this.searchInfo = this.dataBus.getSearchCondi() || [];
      }
    );
  }

  private updatePrice() {
    this.price.base = this.car.price || 0;
    this.price.day = this.calculateRentalDays();
    this.price.total = (this.price.base * this.price.day) + this.price.tax;
  }

  private calculateRentalDays(): number {
    if (!this.searchInfo || !this.searchInfo[2] || !this.searchInfo[4]) {
      return 3;
    }

    var startDate = new Date(this.searchInfo[2]);
    var endDate = new Date(this.searchInfo[4]);

    var diffTime = endDate.getTime() - startDate.getTime();
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return 1;
    }

    return diffDays;
  }

  onchange(event: any) {
    var value = Number(event.target.value);

    if (event.target.checked) {
      this.price.total += value * this.price.day;
    } else {
      this.price.total -= value * this.price.day;
    }
  }

  onclick() {
    if (!this.car || !this.car._id) {
      alert('Selecione um veículo antes de realizar a reserva.');
      return;
    }

    if (!this.car.pickupLoc || this.car.pickupLoc.trim() === '') {
      alert('O veículo selecionado não possui cidade/local de retirada cadastrado.');
      return;
    }

    var pickupLocation = this.car.pickupLoc.trim();
    var dropoffLocation = pickupLocation;

    if (this.searchInfo && this.searchInfo[1] && this.searchInfo[1].trim() !== '') {
      dropoffLocation = this.searchInfo[1].trim();
    }

    var pickupDate = '';
    var dropoffDate = '';

    if (this.searchInfo && this.searchInfo.length >= 6) {
      pickupDate = this.searchInfo[2] + ' ' + this.searchInfo[3];
      dropoffDate = this.searchInfo[4] + ' ' + this.searchInfo[5];
    }

    this.booking.driverinfo = this.driverinfo;
    this.booking.carid = this.car._id;
    this.booking.pickuploc = pickupLocation;
    this.booking.dropoffloc = dropoffLocation;
    this.booking.pickupdate = pickupDate;
    this.booking.dropoffdate = dropoffDate;

    if (this.auth.isLoggedIn()) {
      this.booking.email = this.auth.getUserDetails().email;
    }

    this.booking.price = this.price.total;

    this.bookingservice.createBooking(this.booking).subscribe(
      (data) => {
        this.router.navigateByUrl('/home');
      },
      (err) => {
        console.log('Erro ao criar reserva.');
      }
    );
  }
}

export class pricedetail {
  public day: number;
  public loss: number;
  public pap: number;
  public sli: number;
  public erp: number;
  public tax: number;
  public base: number;
  public total: number;

  constructor(
    day: number,
    loss: number,
    pap: number,
    sli: number,
    erp: number,
    tax: number,
    base: number,
    total: number
  ) {
    this.day = day;
    this.loss = loss;
    this.pap = pap;
    this.sli = sli;
    this.erp = erp;
    this.tax = tax;
    this.base = base;
    this.total = total;
  }
}

export interface driverinfo {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
}