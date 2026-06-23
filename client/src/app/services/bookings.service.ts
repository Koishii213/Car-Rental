import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BookingsService {

  public booking: Booking = new Booking(
    '',
    '',
    '',
    '',
    0,
    '',
    '',
    {
      firstname: '',
      lastname: '',
      email: '',
      phone: ''
    }
  );

  constructor(private http: HttpClient) { }

  getBookingsByEmail(email: string) {
    var userEmail = encodeURIComponent(email);

    return this.http.get('/api/booking/' + userEmail);
  }

  createBooking(booking: Booking) {
    return this.http.post('/api/booking', booking);
  }

  setBooking(booking: Booking) {
    this.booking = booking;
  }

  getBooking() {
    return this.booking;
  }
}

export class Booking {

  public pickupdate: string;
  public dropoffdate: string;
  public pickuploc: string;
  public dropoffloc: string;
  public price: number;
  public carid: string;
  public email: string;
  public driverinfo: object;

  constructor(
    pickupdate: string,
    dropoffdate: string,
    pickuploc: string,
    dropoffloc: string,
    price: number,
    carid: string,
    email: string,
    driverinfo: object
  ) {
    this.pickupdate = pickupdate;
    this.dropoffdate = dropoffdate;
    this.pickuploc = pickuploc;
    this.dropoffloc = dropoffloc;
    this.price = price;
    this.carid = carid;
    this.email = email;
    this.driverinfo = driverinfo;
  }
}