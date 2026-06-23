var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');

var auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
});

var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');
var ctrlacc = require('../controllers/account');

var carList = require('../controllers/products');
var ctrlBooking = require('../controllers/booking');
var carImages = require('../controllers/carImages');
var ctrlfavoritelist = require('../controllers/favoritelist');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

// account
// router.get('/account', ctrlacc.accountRead);
router.get('/account/:email', ctrlacc.accountReadByEmail);
router.post('/account', ctrlacc.createaccount);
router.post('/account/:email', ctrlacc.updateaccountByEmail);

// car CRUD service
router.get('/carlists', carList.readAllCarInfo);
router.post('/carlists', carList.postCarInfor);

// booking
router.get('/booking/:email', ctrlBooking.bookingsReadByEmail);
router.post('/booking', ctrlBooking.createBooking);

// favorite list
router.post('/favoritelist', ctrlfavoritelist.createFavorite);
router.delete('/favoritelist/:email&:carid', ctrlfavoritelist.DeleteFavorite);
router.get('/favoritelist/:email', ctrlfavoritelist.CarsReadByEmail);

// create initial cars
router.get('/carlists/post', carList.createCarContext);

// create car
router.post('/car', carList.createCar);

// delete car
router.delete('/car/:id', carList.deleteCarbyId);

console.log('---/car start---');

// update car
router.put('/car', carList.updateCarInfo);

// search car by id
router.get('/car/:id', carList.searchCarbyID);

// search car by pickup location / city
router.get('/carlists/search/:pickupLoc', carList.searchCarProduct);

// new route for location feature
router.get('/carlists/location/:pickupLoc', carList.searchCarProduct);

// search car by filter condition
router.get('/carlists/filter/:pickupLoc&:priceMax&:priceMin&:carType&:passNum', carList.searchCarwithFilter);

module.exports = router;