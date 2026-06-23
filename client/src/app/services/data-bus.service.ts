import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Car } from '../class/car';

@Injectable()
export class DataBusService {

  public carInfo: Car = new Car(
    '',
    '',
    0,
    0,
    0,
    false,
    false,
    '',
    0,
    '',
    true
  );

  public searchCondi: string[] = ['', '', '', '', '', ''];

  public carValueUpdate: Subject<Car> = new Subject<Car>();
  public carSearchCondiUpdate: Subject<string[]> = new Subject<string[]>();

  constructor() { }

  setCarInfo(car: Car) {
    this.carInfo = car;
    this.carValueUpdate.next(this.carInfo);
  }

  setSearchCondi(data: string[]) {
    if (!data) {
      this.searchCondi = ['', '', '', '', '', ''];
    } else {
      this.searchCondi = data;
    }

    this.carSearchCondiUpdate.next(this.searchCondi);
  }

  clearCarMessage() {
    this.carInfo = new Car(
      '',
      '',
      0,
      0,
      0,
      false,
      false,
      '',
      0,
      '',
      true
    );

    this.carValueUpdate.next(this.carInfo);
  }

  getSearchCondi(): string[] {
    return this.searchCondi;
  }

  getCarInfo(): Car {
    return this.carInfo;
  }
}