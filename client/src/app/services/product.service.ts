import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Car } from '../class/car';
import { NewFilterOptions } from '../home/home.component';

@Injectable()
export class ProductService {

  constructor(private http: HttpClient) { }

  getProductlist(): Observable<Car[]> {
    return this.http.get<Car[]>('/api/carlists');
  }

  getAllProduct(): Observable<Car[]> {
    return this.http.get<Car[]>('/api/carlists');
  }

  postCar(carInfor: Car): void {
    this.http.post('/api/carlists', carInfor).subscribe(
      function(res) {
        console.log('Carro enviado com sucesso.');
      },
      function(err) {
        console.log('Erro ao enviar carro.');
      }
    );
  }

  // Buscar carro pelo ID
  searchCarId(id: string) {
    var carId = encodeURIComponent(id);

    return this.http.get('/api/car/' + carId);
  }

  // Buscar veículos disponíveis por cidade/localização
  searchCarProduct(pickPlace: string): Observable<Car[]> {
    var location = encodeURIComponent(pickPlace);

    return this.http.get<Car[]>('/api/carlists/search/' + location);
  }

  // Buscar veículos disponíveis usando cidade + filtros
  searchCarwithFilter(newOptions: NewFilterOptions): Observable<Car[]> {
    var location = encodeURIComponent(newOptions.pickLocation);
    var priceMax = encodeURIComponent(String(newOptions.priceMax));
    var priceMin = encodeURIComponent(String(newOptions.priceMin));

    var carType = 'NoCarTypes';

    if (newOptions.carType && newOptions.carType.length > 0) {
      carType = encodeURIComponent(newOptions.carType.join(','));
    }

    var passengerNumMax = encodeURIComponent(String(newOptions.passengerNumMax));

    return this.http.get<Car[]>(
      '/api/carlists/filter/' +
      location + '&' +
      priceMax + '&' +
      priceMin + '&' +
      carType + '&' +
      passengerNumMax
    );
  }

  createCar(car: Car) {
    return this.http.post('/api/car', car);
  }

  deleteCarById(id: string) {
    var carId = encodeURIComponent(id);

    return this.http.delete('/api/car/' + carId);
  }

  putCar(car: Car) {
    return this.http.put('/api/car', car);
  }
}