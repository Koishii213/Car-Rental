import { Component, OnInit, Input } from '@angular/core';

import { ProductService } from '../services/product.service';
import { Car } from '../class/car';
import { AuthenticationService } from '../services/authentication.service';
import { favorite, FavoritelistService } from '../services/favoritelist.service';
import { NewFilterOptions } from '../home/home.component';

@Component({
  selector: 'app-carlists',
  templateUrl: './carlists.component.html',
  styleUrls: ['./carlists.component.css']
})
export class CarlistsComponent implements OnInit {

  public selected: number = -1;
  public isAdmin: boolean = false;
  public showCards: boolean = true;

  public loading: boolean = false;
  public total: number = 0;
  public page: number = 1;
  public limit: number = 4;

  public cars: Car[] = [];
  public showinglist: Car[] = [];
  public favorites: favorite[] = [];
  public selectedCar_p: Car | null = null;

  public searchCars: Car[] = [];
  public maintenanceCars: Car[] = [];

  @Input() public pickPlace: string = '';

  public newOptions: NewFilterOptions | null = null;

  constructor(
    private carService: ProductService,
    private favoriteservice: FavoritelistService,
    private auth: AuthenticationService
  ) { }

  ngOnInit() {
    this.isAdmin = this.auth.Ifadmin();

    if (this.auth.isLoggedIn()) {
      this.favoriteservice.getFavoritesByEmail(this.auth.getUserDetails().email).subscribe(
        (data: any) => {
          this.favorites = data;
        },
        (err) => {
          console.log('Erro ao carregar favoritos.');
        }
      );
    }

    if (this.pickPlace && this.pickPlace.trim() !== '') {
      this.searchCarlists();
    } else {
      this.getCarlists();
    }
  }

  footerRunLoc(pickplace: string) {
    this.pickPlace = pickplace;

    if (this.pickPlace && this.pickPlace.trim() !== '') {
      this.pickPlace = this.pickPlace.trim();
      this.searchCarlists();
    } else {
      this.getCarlists();
    }
  }

  footerRunAll() {
    this.getCarlists();
  }

  footerRunFilter(new_options: NewFilterOptions) {
    this.newOptions = new_options;
    this.searchCarFilter();
  }

  searchCarFilter() {
    if (!this.newOptions) {
      return;
    }

    this.loading = true;

    this.carService.searchCarwithFilter(this.newOptions).subscribe(
      (res: Car[]) => {
        this.updateCarList(res);
        this.loading = false;
      },
      (error1) => {
        console.log('Erro ao buscar veículos com filtro.');
        this.loading = false;
      }
    );
  }

  searchCarlists() {
    if (!this.pickPlace || this.pickPlace.trim() === '') {
      this.getCarlists();
      return;
    }

    this.loading = true;

    this.carService.searchCarProduct(this.pickPlace).subscribe(
      (res: Car[]) => {
        this.updateCarList(res);
        this.loading = false;
      },
      (error1) => {
        console.log('Erro ao buscar veículos por cidade.');
        this.loading = false;
      }
    );
  }

  getCarlists() {
    this.loading = true;

    this.carService.getAllProduct().subscribe(
      (res: Car[]) => {
        this.updateCarList(res);
        this.loading = false;
      },
      (error1) => {
        console.log('Erro ao carregar lista de veículos.');
        this.loading = false;
      }
    );
  }

  private updateCarList(carList: Car[]) {
    this.cars = carList || [];
    this.total = this.cars.length;
    this.page = 1;
    this.selected = -1;
    this.selectedCar_p = null;
    this.showinglist = this.cars.slice(0, this.limit);
  }

  addCarToMaintenance(car: Car) {
    var alreadyInMaintenance = this.maintenanceCars.some(
      (item: any) => item._id === (car as any)._id
    );

    if (!alreadyInMaintenance) {
      this.maintenanceCars.push(car);
    }
  }

  removeCarFromMaintenance(car: Car) {
    this.maintenanceCars = this.maintenanceCars.filter(
      (item: any) => item._id !== (car as any)._id
    );
  }

  showCarsInMaintenance() {
    this.cars = this.maintenanceCars;
    this.total = this.maintenanceCars.length;
    this.page = 1;
    this.selected = -1;
    this.selectedCar_p = null;
    this.showinglist = this.maintenanceCars.slice(0, this.limit);
  }

  isCarInMaintenance(car: Car): boolean {
    return this.maintenanceCars.some(
      (item: any) => item._id === (car as any)._id
    );
  }

  onSelect(e: number) {
    if (e !== this.selected) {
      this.selected = e;
      this.selectedCar_p = this.showinglist[e];
    } else {
      this.selected = -1;
      this.selectedCar_p = null;
    }
  }

  getFrom(): number {
    return (this.limit * this.page) - this.limit;
  }

  getTo(): number {
    var max = this.limit * this.page;

    if (max > this.total) {
      max = this.total;
    }

    return max;
  }

  goToPage(n: number): void {
    if (this.page !== n) {
      this.selected = -1;
      this.selectedCar_p = null;
      this.page = n;
      this.showinglist = this.cars.slice(this.getFrom(), this.getTo());
    }
  }

  onNext(): void {
    if (this.getTo() < this.total) {
      this.page++;
      this.selected = -1;
      this.selectedCar_p = null;
      this.showinglist = this.cars.slice(this.getFrom(), this.getTo());
    }
  }

  onPrev(): void {
    if (this.page > 1) {
      this.page--;
      this.selected = -1;
      this.selectedCar_p = null;
      this.showinglist = this.cars.slice(this.getFrom(), this.getTo());
    }
  }
}