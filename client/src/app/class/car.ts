export class Car {

  constructor(
    public name: string = '',
    public type: string = '',
    public passengers: number = 0,
    public price: number = 0,
    public luggage: number = 0,
    public isAuto: boolean = false,
    public ACsup: boolean = false,

    // Cidade ou local onde o veículo está disponível
    public pickupLoc: string = '',

    public insurance: number = 0,
    public imageName: string = '',
    public isavailable: boolean = true,
    public _id?: string
  ) { }

}


export class Boooking {

  constructor(
    public car_ID: string = '',
    public startDate: Date = new Date(),
    public finishDate: Date = new Date(),

    // Local de retirada da reserva
    public pickupLocation: string = '',

    // Local de devolução da reserva
    public returnLocation: string = ''
  ) { }

}