var mongoose = require('mongoose');

var bookingSchema = new mongoose.Schema({
    pickupdate: {
        type: String,
        default: ''
    },

    dropoffdate: {
        type: String,
        default: ''
    },

    // Cidade/local de retirada do veículo
    pickuploc: {
        type: String,
        default: ''
    },

    // Cidade/local de devolução do veículo
    dropoffloc: {
        type: String,
        default: ''
    },

    price: {
        type: Number,
        default: 0
    },

    carid: {
        type: String,
        default: ''
    },

    email: {
        type: String,
        default: ''
    },

    driverinfo: {
        type: Object,
        default: {}
    }
});

module.exports = mongoose.model('Booking', bookingSchema);