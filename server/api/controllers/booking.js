var mongoose = require('mongoose');

var Booking = mongoose.model('Booking');
var Car = mongoose.model('Cars');

function isValidEmail(email) {
    return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildBookingData(body) {
    return {
        pickupdate: body.pickupdate,
        dropoffdate: body.dropoffdate,
        pickuploc: body.pickuploc,
        dropoffloc: body.dropoffloc,
        price: body.price,
        carid: body.carid,
        email: body.email,
        driverinfo: body.driverinfo
    };
}

module.exports.bookingRead = function(req, res) {
    Booking.find(function (err, booking) {
        if (err) {
            return res.send(err);
        }

        res.json(booking);
    });
};

module.exports.bookingsReadByEmail = function (req, res) {
    var email = req.params.email;

    if (!isValidEmail(email)) {
        return res.status(400).json({
            message: 'Invalid email'
        });
    }

    Booking.find({ email: email }, function (err, bookings) {
        if (err) {
            return res.send(err);
        }

        res.json(bookings);
    });
};

module.exports.createBooking = function (req, res) {
    var carid = req.body.carid;

    if (!mongoose.Types.ObjectId.isValid(carid)) {
        return res.status(400).json({
            message: 'Invalid car id'
        });
    }

    var carObjectId = mongoose.Types.ObjectId.createFromHexString(carid);

    var bookingData = buildBookingData(req.body);

    if (!bookingData.pickuploc || !bookingData.dropoffloc) {
        return res.status(400).json({
            message: 'Pickup and dropoff locations are required'
        });
    }

    var booking = new Booking(bookingData);

    Car.findOne({ _id: carObjectId, isavailable: true }, function(err, car) {
        if (err) {
            return res.send(err);
        }

        if (!car) {
            return res.status(409).json({
                message: 'Car is not available for booking'
            });
        }

        booking.save(function (err) {
            if (err) {
                return res.send(err);
            }

            Car.update(
                { _id: carObjectId },
                {
                    $set: {
                        isavailable: false
                    }
                },
                function(err, affected, resp) {
                    if (err) {
                        return res.send(err);
                    }

                    res.json({
                        message: 'Booking created'
                    });
                }
            );
        });
    });
};