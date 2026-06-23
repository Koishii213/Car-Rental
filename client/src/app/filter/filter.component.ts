import { Component, EventEmitter, OnInit, Output, AfterViewInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit, AfterViewInit {

  public psgervalue: number = 7;
  public pricelist: any[] = [];
  public options: any[] = [];

  public formModel: FormGroup = new FormGroup({
    price: new FormControl('0'),
    type: new FormArray([
      new FormControl(true),
      new FormControl(true),
      new FormControl(true),
      new FormControl(true),
      new FormControl(true)
    ]),
    paserNum: new FormControl(7),
    age: new FormControl('larger18')
  });

  @Output()
  public carFilter: EventEmitter<FilterOptions> = new EventEmitter<FilterOptions>();

  constructor() { }

  ngOnInit() {
    this.psgervalue = 7;

    this.options = [
      { id: 'eco', text: 'Economy', state: true },
      { id: 'cmpt', text: 'Compact', state: true },
      { id: 'std', text: 'Standard', state: true },
      { id: 'suv', text: 'SUV', state: true },
      { id: 'lux', text: 'Luxury', state: true }
    ];

    this.pricelist = [
      { id: '0', text: '--TODOS--' },
      { id: '1', text: 'Abaixo de $50' },
      { id: '2', text: '$50 - $100' },
      { id: '3', text: '$100 - $150' },
      { id: '4', text: '$150 - $200' },
      { id: '5', text: 'Acima de $200' }
    ];
  }

  ngAfterViewInit() {
    this.formModel.valueChanges.subscribe(value => {
      this.onSubmit(value);
    });

    this.onSubmit(this.formModel.value);
  }

  typecheckAll(ev: any) {
    var checked = ev.target.checked;

    this.options.forEach(function(option) {
      option.state = checked;
    });

    var typeArray = this.formModel.controls['type'] as FormArray;

    for (var i = 0; i < typeArray.length; i++) {
      typeArray.at(i).setValue(checked);
    }
  }

  isAllChecked() {
    return this.options.every(function(option) {
      return option.state;
    });
  }

  getMinPrice(index: string): number {
    switch (index) {
      case '0':
      case '1':
        return 0;

      case '2':
        return 50;

      case '3':
        return 100;

      case '4':
        return 150;

      case '5':
        return 200;

      default:
        return 0;
    }
  }

  getMaxPrice(index: string): number {
    if (index === '0') {
      return 5000;
    }

    if (index === '1') {
      return 50;
    }

    return this.getMinPrice(index) + 50;
  }

  getTypes(index: Array<boolean>): Array<string> {
    var types: Array<string> = new Array<string>();

    for (var i = 0; i < index.length; i++) {
      if (index[i]) {
        if (this.options[i].text === 'Luxury' && this.formModel.value.age !== 'larger18') {
          continue;
        }

        types.push(this.options[i].text);
      }
    }

    return types;
  }

  onSubmit(value: any) {
    var values = this.formModel.value;

    this.psgervalue = Number(values.paserNum);

    var min = this.getMinPrice(values.price);
    var max = this.getMaxPrice(values.price);
    var cartypes = this.getTypes(values.type);

    var max_pasgerNum = Number(values.paserNum);

    if (!max_pasgerNum) {
      max_pasgerNum = 7;
    }

    var isAdult = values.age === 'larger18';

    this.carFilter.emit(
      new FilterOptions(
        min,
        max,
        cartypes,
        max_pasgerNum,
        isAdult
      )
    );
  }
}

export class FilterOptions {
  constructor(
    public price_min: number,
    public price_max: number,
    public carType: Array<string>,
    public pasgerNum_max: number,
    public isAdult: boolean
  ) { }
}