import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ProductService } from '../services/product.service';
import { Car } from '../class/car';

@Component({
  selector: 'app-admincontrolpanel',
  templateUrl: './admincontrolpanel.component.html',
  styleUrls: ['./admincontrolpanel.component.css']
})
export class AdmincontrolpanelComponent implements OnInit {

  @Output() public getAll = new EventEmitter<void>();
  @Input() public seletedCar: Car | null = null;

  public showDeleteDialog: boolean = false;
  public showUpdataDialog: boolean = false;
  public showAddDialog: boolean = false;

  public imageUrl: string = '/assets/car-rental-logo.jpg';
  public fileToUpload: File | null = null;

  public formCarInfo: Car = new Car(
    '',
    'Standard',
    2,
    0,
    2,
    true,
    true,
    '',
    0,
    '/assets/car-rental-logo.jpg',
    true
  );

  constructor(
    private productService: ProductService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.initCarForm();
  }

  initCarForm() {
    this.formCarInfo = new Car(
      '',
      'Standard',
      2,
      0,
      2,
      true,
      true,
      '',
      0,
      '/assets/car-rental-logo.jpg',
      true
    );

    this.imageUrl = '/assets/car-rental-logo.jpg';
    this.fileToUpload = null;
  }

  confirmDelete() {
    if (!this.seletedCar || !this.seletedCar._id) {
      return;
    }

    this.productService.deleteCarById(this.seletedCar._id).subscribe(
      (data) => {
        this.getAllCarList();
      },
      (err) => {
        console.log('Erro ao remover veículo.');
      }
    );

    this.showDeleteDialog = false;
  }

  getAllCarList() {
    this.getAll.emit();

    this.showDeleteDialog = false;
    this.showUpdataDialog = false;
    this.showAddDialog = false;
  }

  closeDialog() {
    this.showDeleteDialog = false;
    this.showUpdataDialog = false;
    this.showAddDialog = false;
  }

  addBtnClicked() {
    this.initCarForm();
    this.showAddDialog = true;
  }

  editBtnClick() {
    if (this.seletedCar != null) {
      this.formCarInfo = this.seletedCar;
      this.showUpdataDialog = true;
    }
  }

  deleteBtnClick() {
    if (this.seletedCar != null) {
      this.showDeleteDialog = !this.showDeleteDialog;
    }
  }

  handleFileInput(file: FileList) {
    if (!file || file.length === 0) {
      return;
    }

    this.fileToUpload = file.item(0);

    if (!this.fileToUpload) {
      return;
    }

    var reader = new FileReader();

    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    };

    reader.readAsDataURL(this.fileToUpload);

    this.formCarInfo.imageName = '/assets/uploadedImage/' + this.fileToUpload.name;
  }

  onImageSubmit() {
    if (!this.fileToUpload) {
      return;
    }

    var formData: FormData = new FormData();

    formData.append('CarImage', this.fileToUpload, this.fileToUpload.name);

    this.http.post('/api/image/post', formData).subscribe(
      (res) => {
        console.log('Imagem enviada com sucesso.');
      },
      (err) => {
        console.log('Erro ao enviar imagem.');
      }
    );
  }

  clickToAddCar() {
    if (!this.formCarInfo.pickupLoc || this.formCarInfo.pickupLoc.trim() === '') {
      alert('Informe a cidade/local de retirada do veículo.');
      return;
    }

    this.formCarInfo.pickupLoc = this.formCarInfo.pickupLoc.trim();

    this.productService.createCar(this.formCarInfo).subscribe(
      (data) => {
        this.getAllCarList();
      },
      (err) => {
        console.log('Erro ao cadastrar veículo.');
      }
    );

    this.showAddDialog = false;
  }

  confirmUpdateCarInfo() {
    if (!this.formCarInfo.pickupLoc || this.formCarInfo.pickupLoc.trim() === '') {
      alert('Informe a cidade/local de retirada do veículo.');
      return;
    }

    this.formCarInfo.pickupLoc = this.formCarInfo.pickupLoc.trim();

    this.productService.putCar(this.formCarInfo).subscribe(
      (data) => {
        this.getAllCarList();
      },
      (err) => {
        console.log('Erro ao atualizar veículo.');
      }
    );

    this.showUpdataDialog = false;
  }
}