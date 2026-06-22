var mongoose = require('mongoose');

var Booking = mongoose.model('Booking');
var Car = mongoose.model('Cars');

function sendErrorOrJson(res, err, data) {
    if (err) {
        return res.send(err);
    }

    return res.json(data);
}

function buildBookingData(body) {
    return {
        email: body.email,
        car: body.car,
        startdate: body.startdate,
        enddate: body.enddate,
        pickuploc: body.pickuploc,
        dropoffloc: body.dropoffloc,
        totalprice: body.totalprice
    };
}

function updateCarAvailability(carid, callback) {
    Car.update(
        { _id: carid },
        {
            $set: {
                isavailable: false
            }
        },
        callback
    );
}

function saveBooking(res, booking) {
    booking.save(function saveBookingCallback(err) {
        if (err) {
            return res.send(err);
        }

        return res.json({ message: 'Booking created' });
    });
}

module.exports.bookingRead = function bookingRead(req, res) {
    Booking.find(function findBookingsCallback(err, bookings) {
        return sendErrorOrJson(res, err, bookings);
    });
};

module.exports.bookingsReadByEmail = function bookingsReadByEmail(req, res) {
    Booking.find(
        { email: req.params.email },
        function findBookingsByEmailCallback(err, bookings) {
            return sendErrorOrJson(res, err, bookings);
        }
    );
};

module.exports.createBooking = function createBooking(req, res) {
    var booking = new Booking(buildBookingData(req.body));
    var carid = req.body.carid;

    updateCarAvailability(carid, function updateCarAvailabilityCallback(err) {
        if (err) {
            return res.send(err);
        }

        return saveBooking(res, booking);
    });
};