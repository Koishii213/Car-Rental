import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProductService} from "../services/product.service";
import {Car} from "../class/car";
import {HttpClient, HttpHeaders} from "@angular/common/http";
// import { saveAs } from 'file-saver/FileSaver';
import {observeOn} from "rxjs/operators";

@Component({
  selector: 'app-admincontrolpanel',
  templateUrl: './admincontrolpanel.component.html',
  styleUrls: ['./admincontrolpanel.component.css']
})
export class AdmincontrolpanelComponent implements OnInit {

  @Output() private readonly getAll = new EventEmitter();
  @Input() seletedCar: Car;

  showDeleteDialog: boolean = false;
  showUpdataDialog: boolean = false;
  showAddDialog: boolean = false;

  // imageName:string;
  imageUrl: string = '/assets/car-rental-logo.jpg';
  fileToUpload: File;
  formCarInfo: Car;

  constructor(
    private readonly productService: ProductService,
    private readonly http: HttpClient
  ) {
  }

  ngOnInit() {
    this.seletedCar = null;

    if (this.seletedCar != null) {
      this.formCarInfo = this.seletedCar;
    } else {
      this.initCarForm();
    }
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
      "",
      0,
      '/assets/car-rental-logo.jpg',
      true
    );
  }

  confirmDelete() {
    this.productService.deleteCarById(this.seletedCar._id).subscribe(
      (data) => {
        console.log('*********');
      },
      (err) => {
        console.log(err);
      }
    );

    this.getAllCarList();
    this.showDeleteDialog = false;
    console.log("confirm delete: " + this.seletedCar._id + this.seletedCar.name);
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
    this.initCarForm();

    if (this.seletedCar != null) {
      this.showUpdataDialog = true;
      this.formCarInfo = this.seletedCar;
    }
  }

  deleteBtnClick() {
    if (this.seletedCar != null) {
      this.showDeleteDialog = !this.showDeleteDialog;
    }
  }

  handleFileInput(file: FileList) {
    console.log('handlefile');
    this.fileToUpload = file.item(0);

    let reader = new FileReader();

    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    };

    reader.readAsDataURL(this.fileToUpload);
    this.formCarInfo.imageName = '/assets/uploadedImage/' + this.fileToUpload.name;
  }

  onImageSubmit() {
    console.log('onImageSubmit');

    let file = this.fileToUpload;

    const formData: FormData = new FormData();
    formData.append('CarImage', file, file.name);

    console.log(formData);

    this.http.post('/api/image/post', formData)
      .subscribe(
        res => {
          console.log("get response after post picture");
          console.log(res);
        },
        err => {
          console.log("Error occured when post Image");
        }
      );

    console.log('postCar finish');
  }

  // setACsup($event) {
  // }

  // setIsAuto($event) {
  // }

  clickToAddCar() {
    this.showAddDialog = false;

    console.log(this.formCarInfo);

    this.productService.createCar(this.formCarInfo).subscribe(
      (data) => {
        console.log(data);
      },
      (err) => {
        console.log(err);
      }
    );

    this.getAllCarList();
  }

  confirmUpdateCarInfo() {
    this.showUpdataDialog = false;

    console.log('---updated infor---');
    console.log(this.formCarInfo);

    this.productService.putCar(this.formCarInfo).subscribe(
      (data) => {
        console.log(data);
      },
      (err) => {
        console.log(err);
      }
    );

    this.getAllCarList();
  }
}