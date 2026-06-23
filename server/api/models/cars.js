var mongoose = require('mongoose');

var carsSchema = new mongoose.Schema({
    name: String,
    type: String,
    passengers: Number,
    price: Number,
    luggage: Number,
    isAuto: Boolean,
    ACsup: Boolean,

    // Cidade ou local onde o veículo está disponível para retirada
    pickupLoc: {
        type: String,
        default: ''
    },

    insurance: Number,
    imageName: String,

    // Controla se o veículo aparece ou não nas buscas dos clientes
    isavailable: {
        type: Boolean,
        default: true
    }
});

mongoose.model('Cars', carsSchema);