require('../models/database');
const Photographer = require('../models/Photographer');
const Packages = require('../models/Packages');
const Entertainer = require('../models/entertainer');
const Venue = require('../models/venues');
const User = require('../models/user');



/**
 * GET /
 * 
*/
exports.homepage = async (req, res) => {
  try {
    const limitNumber = 10;
    const packages = await Packages.find({}).limit(limitNumber);
    res.render('index', { packages });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
}

/**----------------------------------------------------------------packages------------------------------------------------------ */


/**
 * GET / packages
 * 
*/
exports.explorePackages = async (req, res) => {

  Packages.find({}).then(packages => {
    res.render('index',
      {
        packagesList: packages
      })
  }
  )
}

/**
 * GET /package name 
 *
 */
exports.packageName = async (req, res) => {
  try {
    let packageId = req.params.id;
    const packages = await Packages.findById(packageId);
    res.render('packages',
      { packages });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
}

/**--------------------------------------------------------user-signup------------------------------------------------------ */

/**
 * GET / signup
 * signup form
*/
exports.signup = async (req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');

  res.render('signup', { infoErrorsObj, infoSubmitObj })
}


/**
 * POST /
 * user registration
*/
exports.registerUserOnPost = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    var reg_pwd = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$^&*()_-]).{8,}$/;

    if (user) {
      req.flash('infoErrors', 'User already exists.');
      res.redirect('/signup');
    }
    if (!reg_pwd.test(req.body.password)) {
      req.flash('infoErrors', 'Password should contain at least 8 characters including one lowercase letter, one uppercase letter, one digit, one special character.');
      res.redirect('/signup');
    }
    if (req.body.password != req.body.confirm_password) {
      req.flash('infoErrors', 'Password and confirm password do not match.');
      res.redirect('/signup');
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });

    await newUser.save();

    console.log("posted");
    console.log(hashedPassword);
    // req.session.user = {id: newUser._id , name: newUser.name};

    req.flash('infoSubmit', 'User has been registered.')
    res.redirect('/');
  } catch (error) {
    req.flash('infoErrors', error);
    res.redirect('/signup');
  }
}

/**------------------------------------------------------venue------------------------------------------------------ */


/**
 * GET / venue
 * venues
*/
exports.exploreVenues = async (req, res) => {
  try {
    const queryObj = {}

    // Handle budget range filtering
    if (req.query.guests) {
      const guestsRange = req.query.guests.split('-');
      const minAmount = parseInt(guestsRange[0]);
      const maxAmount = parseInt(guestsRange[1]);

      // Create budgetObject based on input conditions
      const guestsObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        guestsObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        guestsObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        guestsObject.$gte = minAmount;
        guestsObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.guests = guestsObject;
    }

    if (req.query.starting_price) {
      const priceRange = req.query.starting_price.split('-');
      const minAmount = parseInt(priceRange[0]);
      const maxAmount = parseInt(priceRange[1]);

      // Create budgetObject based on input conditions
      const priceObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        priceObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        priceObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        priceObject.$gte = minAmount;
        priceObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.starting_price = priceObject;
    }

    // Handle room price range filtering
    if (req.query.room_start_price) {
      const roomPriceRange = req.query.room_start_price.split('-');
      const minAmount = parseInt(roomPriceRange[0]);
      const maxAmount = parseInt(roomPriceRange[1]);

      // Create budgetObject based on input conditions
      const roomPriceObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        roomPriceObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        roomPriceObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        roomPriceObject.$gte = minAmount;
        roomPriceObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.room_start_price = roomPriceObject;
    }

    // Handle room count range filtering
    if (req.query.room_count) {
      const roomCountRange = req.query.room_count.split('-');
      const minAmount = parseInt(roomCountRange[0]);
      const maxAmount = parseInt(roomCountRange[1]);

      // Create budgetObject based on input conditions
      const roomCountObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        roomCountObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        roomCountObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        roomCountObject.$gte = minAmount;
        roomCountObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.room_count = roomCountObject;
    }

    // Handle rating range filtering
    if (req.query.averageRating) {
      const ratingRange = req.query.averageRating.split('-');
      const minAmount = parseInt(ratingRange[0]);
      const maxAmount = parseInt(ratingRange[1]);

      // Create budgetObject based on input conditions
      const ratingObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        ratingObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        ratingObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        ratingObject.$gte = minAmount;
        ratingObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.averageRating = ratingObject;
    }
    // Handle search filtering
    if (req.query.search) {
      const searchTerm = req.query.search;
      const regex = new RegExp(searchTerm, 'i');
      queryObj.$or = [
        { name: regex }, // Search in the 'name' field
        { location: regex }
      ];
    }

    // Handle services filtering
    if (req.query.services) {
      const services = req.query.services.split(','); // assuming services are comma-separated
      queryObj.services = { $in: services };
    }
    // Handle space filtering
    if (req.query.space) {
      const spaces = req.query.space.split(','); // assuming services are comma-separated
      queryObj.space = { $in: spaces };
    }

    // Handle venue type filtering
    if (req.query.venue_type) {
      const venue_type = req.query.venue_type.split(','); // assuming services are comma-separated
      queryObj.venue_type = { $in: venue_type };
    }

    await Venue.find(queryObj).then(venues => {
      res.render('venues',
        {
          venueList: venues
        })
    })
  }

  catch (error) {
    res.status(500).send(error)
  }
}

/**
 * GET /venues/:id
 * Venue 
*/
exports.exploreVenue = async (req, res) => {
  try {
    let venueId = req.params.id;
    await Venue.findById(venueId).then(venue => {
      const ratings = venue.ratings;
      const totalRatings = ratings.reduce((sum, rating) => sum + rating.rate, 0);
      const avgRatingUnRounded = Math.round((totalRatings / ratings.length) * 10) / 10;
      const avgRating = avgRatingUnRounded.toFixed(1);
      res.render('venue_details', { venue: venue, avgRating: avgRating });
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}


/**
 * POST / venue / :id
 * rate photographer
*/
exports.rateVenue = async (req, res) => {
  try {
    const venueId = req.params.id
    const venue = await Venue.findById(venueId);
    const rating = req.body.rating;
    const ratings = { user_id: "pqr", rate: rating }
    venue.ratings.push(ratings)
    venue.save();

    const rates = venue.ratings;
    const totalRatings = rates.reduce((sum, rating) => sum + rating.rate, 0);
    const avgRatingUnRounded = Math.round((totalRatings / rates.length) * 10) / 10;
    const avgRating = avgRatingUnRounded.toFixed(1);
    console.log(avgRating)

    await Venue.findOneAndUpdate({ _id: venueId }, {
      $set: {
        averageRating: avgRating
      }
    })

    res.redirect("/venues/" + `${venueId}`);
  }
  catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" })
  }
}


/**
 * GET /register-venue
 * venue-registration
*/
exports.registerVenue = async (req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('venue_details_form', { title: 'Dream Stories - Organisation Registration ', infoErrorsObj, infoSubmitObj });
}


/**
 * POST /register-venue
 * register on post
*/

exports.registerVenueOnPost = async (req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No Files where uploaded.');
      console.log(req.files)
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;


      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.satus(500).send(err);
      })

    }

    const food_types = Array.isArray(req.body.food_type) ? req.body.food_type : [req.body.food_type];
    const food_prices = Array.isArray(req.body.food_price) ? req.body.food_price : [req.body.food_price];

    const foods = [];

    for (let i = 0; i < Math.max(food_types.length, food_prices.length); i++) {
      const foodType = food_types[i] || ''; // Use empty string if package name doesn't exist
      const foodPrice = food_prices[i] || 0; // Use 0 if package price doesn't exist
      foods.push({ food_type: foodType, food_price: foodPrice });
    }

    const hall_names = Array.isArray(req.body.hall_name) ? req.body.hall_name : [req.body.hall_name];
    const hall_spaces = Array.isArray(req.body.hall_space) ? req.body.hall_space : [req.body.hall_space];
    const hall_seatings = Array.isArray(req.body.hall_seating) ? req.body.hall_seating : [req.body.hall_seating];
    const hall_floatings = Array.isArray(req.body.hall_floating) ? req.body.hall_floating : [req.body.hall_floating];
    const hall_prices = Array.isArray(req.body.hall_price) ? req.body.hall_price : [req.body.hall_price];

    const halls = [];

    for (let i = 0; i < Math.max(hall_names.length, hall_spaces.length, hall_seatings.length, hall_floatings.length, hall_prices.length); i++) {
      const hallName = hall_names[i] || ''; // Use empty string if package name doesn't exist
      const hallSpace = hall_spaces[i] || '';
      const hallSeating = hall_seatings[i] || 0;
      const hallFloating = hall_floatings[i] || 0;
      const hallPrice = hall_prices[i] || 0; // Use 0 if package price doesn't exist
      halls.push({ hall_name: hallName, hall_space: hallSpace, hall_seating: hallSeating, hall_floating: hallFloating, hall_price: hallPrice });
    }


    const events = Array.isArray(req.body.event) ? req.body.event : [req.body.event];
    const decor_prices = Array.isArray(req.body.decor_price) ? req.body.decor_price : [req.body.decor_price];

    const decors = [];

    for (let i = 0; i < Math.max(events.length, decor_prices.length); i++) {
      const event = events[i] || ''; // Use empty string if package name doesn't exist
      const decorPrice = decor_prices[i] || 0; // Use 0 if package price doesn't exist
      decors.push({ event: event, decor_price: decorPrice });
    }

    const room_names = Array.isArray(req.body.room_name) ? req.body.room_name : [req.body.room_name];
    const room_prices = Array.isArray(req.body.room_price) ? req.body.room_price : [req.body.room_price];

    const rooms = [];

    for (let i = 0; i < Math.max(room_names.length, room_prices.length); i++) {
      const roomName = room_names[i] || ''; // Use empty string if package name doesn't exist
      const roomPrice = room_prices[i] || 0; // Use 0 if package price doesn't exist
      rooms.push({ room_name: roomName, room_price: roomPrice });
    }

    const newVenue = new Venue({
      name: req.body.name,
      address: req.body.address,
      location: req.body.location,
      addressUrl: req.body.addressUrl,
      about: req.body.about,
      contact: req.body.contact,
      email: req.body.email,
      services: req.body.services,
      since: req.body.since,
      venue_type: req.body.venue_type,
      parking: req.body.parking,
      smallpartyvenue: req.body.small_party,
      features: req.body.features,
      space: req.body.space,
      starting_price: req.body.starting_price,
      room_start_price: req.body.room_start_price,
      room_count: req.body.room_count,
      guests: req.body.guests,
      catering_policy: req.body.catering,
      decor_policy: req.body.decor,
      outside_alcohol: req.body.alcohol,
      dj_policy: req.body.dj,
      instaUrl: req.body.instaUrl,
      fbUrl: req.body.fbUrl,
      profilePhoto: newImageName
    });

    newVenue.food_price = foods;
    newVenue.halls = halls;
    newVenue.rooms = rooms;
    newVenue.decor = decors;
    await newVenue.save();

    req.flash('infoSubmit', 'Organisation has been registered.')
    res.redirect('/register-venue');
  } catch (error) {
    req.flash('infoErrors', error);
    console.log(error)
    res.redirect('/register-venue');
  }
}



/**
 * GET /venues/edit/:id
 * photographer-packages
*/
exports.venuesEdit = async (req, res) => {
  try {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    const venueId = req.params.id;
    const venue = await Venue.findById(venueId)
    res.render('venue_edit', { venue, infoErrorsObj, infoSubmitObj })

  }
  catch (err) {
    res.status(500).send(err)
  }
}

/** 
 * POST /venues/edit/:id
 * photographer-updation
*/

exports.venuesEditPost = async (req, res) => {
  try {
    const venueId = req.params.id;
   
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No Files where uploaded.');
      console.log(req.files)
    } else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;
      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;
      imageUploadFile.mv(uploadPath, function (err) {
        if (err) {
          console.error(err);
          return res.status(500).send(err);
        }
        console.log('File uploaded successfully!');
      })

    }

    const hall_names = Array.isArray(req.body.hall_name) ? req.body.hall_name : [req.body.hall_name];
    const hall_spaces = Array.isArray(req.body.hall_space) ? req.body.hall_space : [req.body.hall_space];
    const hall_seatings = Array.isArray(req.body.hall_seating) ? req.body.hall_seating : [req.body.hall_seating];
    const hall_floatings = Array.isArray(req.body.hall_floating) ? req.body.hall_floating : [req.body.hall_floating];
    const hall_prices = Array.isArray(req.body.hall_price) ? req.body.hall_price : [req.body.hall_price];
    const halls = [];
    for (let i = 0; i < Math.max(hall_names.length, hall_prices.length); i++) {
      const hallName = hall_names[i] || ''; // Use empty string if package name doesn't exist
      const hallSpace = hall_spaces[i] || '';
      const hallSeating = hall_seatings[i] || 0;
      const hallFloating = hall_floatings[i] || 0;
      const hallPrice = hall_prices[i] || 0; // Use 0 if package price doesn't exist
      halls.push({ hall_name: hallName, hall_space: hallSpace, hall_seating: hallSeating, hall_floating: hallFloating, hall_price: hallPrice });
    }

    const events = Array.isArray(req.body.event) ? req.body.event : [req.body.event];
    const decor_prices = Array.isArray(req.body.decor_price) ? req.body.decor_price : [req.body.decor_price];
    const decors = [];
    for (let i = 0; i < Math.max(events.length, decor_prices.length); i++) {
      const event = events[i] || ''; // Use empty string if package name doesn't exist
      const decorPrice = decor_prices[i] || 0; // Use 0 if package price doesn't exist
      decors.push({ event: event, decor_price: decorPrice });
    }

    const room_names = Array.isArray(req.body.room_name) ? req.body.room_name : [req.body.room_name];
    const room_prices = Array.isArray(req.body.room_price) ? req.body.room_price : [req.body.room_price];
    const rooms = [];
    for (let i = 0; i < Math.max(room_names.length, room_prices.length); i++) {
      const roomName = room_names[i] || ''; // Use empty string if package name doesn't exist
      const roomPrice = room_prices[i] || 0; // Use 0 if package price doesn't exist
      rooms.push({ room_name: roomName, room_price: roomPrice });
    }

    const venue = await Venue.findOneAndUpdate({ _id: venueId }, {
      $set: {
        name: req.body.name,
        address: req.body.address,
        location: req.body.location,
        addressUrl: req.body.addressUrl,
        about: req.body.about,
        contact: req.body.contact,
        email: req.body.email,
        services: req.body.services,
        since: req.body.since,
        venue_type: req.body.venue_type,
        parking: req.body.parking,
        smallpartyvenue: req.body.small_party,
        features: req.body.features,
        space: req.body.space,
        starting_price: req.body.starting_price,
        room_start_price: req.body.room_start_price,
        room_count: req.body.room_count,
        guests: req.body.guests,
        catering_policy: req.body.catering,
        decor_policy: req.body.decor,
        outside_alcohol: req.body.alcohol,
        dj_policy: req.body.dj,
        halls: halls,
        rooms: rooms,
        decor: decors,
        instaUrl: req.body.instaUrl,
        fbUrl: req.body.fbUrl,
        profilePhoto: newImageName
      }
    },
      { upsert: true, new: true }
    )
    console.log('Halls:', halls);
    console.log('Decors:', decors);
    console.log('Rooms:', rooms);

    venue.save();
    req.flash('infoSubmit', 'Venue has been updated.')
    res.redirect('/venues/edit/' + `${venueId}`)

  }
  catch (err) {
    res.status(500).send(err)
  }
}


/**
 * GET /venues/add-hall/:id
 * photographer-add-halls
*/
exports.addVenueHall = async (req, res) => {
  const venueId = req.params.id;
  const venue = await Venue.findById(venueId)
  res.render('addVenueHalls', { venue })
}

/**
 * POST /venues/add-hall/:id
 * photographer-add-halls
*/
exports.addVenueHallOnPost = async (req, res) => {
  try {
    const venueId = req.params.id;
    const { hall_name, hall_space, hall_seating, hall_floating, hall_price } = req.body;

    const hallsToAdd = [];

    if (!Array.isArray(hall_name)) {
      // If package_name is not an array, convert it into an array
      hallsToAdd.push({ hall_name, hall_space: hall_space || '', hall_seating: hall_seating || 0, hall_floating: hall_floating || 0, hall_price: hall_price || 0 });
    } else {
      // If package_name is an array, iterate through each element
      for (let i = 0; i < hall_name.length; i++) {
        const hallName = hall_name[i];
        const hallSpace = hall_space || '';
        const hallSeating = hall_seating || 0;
        const hallFloating = hall_floating || 0;
        const hallPrice = hall_price[i] || 0;
        hallsToAdd.push({ hall_name: hallName, hall_space: hallSpace, hall_seating: hallSeating, hall_floating: hallFloating, hall_price: hallPrice });
      }
    }

    await Venue.findOneAndUpdate(
      { _id: venueId },
      {
        $push: {
          halls: {
            $each: hallsToAdd
          }
        }
      }
    );

    req.flash('infoSubmit', 'Hall Added!')
    res.redirect('/venues/edit/' + `${venueId}`)

  }
  catch (error) {
    req.flash('infoErrors', error);
    res.status(500).send(error)
  }
}


/**
 * POST /venues/del-hall/:id/:pid
 * photographer-hall-delete
*/
exports.delVenueHall = async (req, res) => {
  try {
    const venueId = req.params.id;
    const hallId = req.params.pid;
    const venue = await Venue.findById(venueId);

    venue.halls.pull(hallId)

    await venue.save();

    req.flash('infoSubmit', 'Hall deleted successfully.')
    res.redirect('/venues/edit/' + `${venueId}`);

  }
  catch (err) {
    req.flash('infoErrors', error);
    res.status(500).send(err)
  }
}


/**
 * GET /venues/add-room/:id
 * photographer-add-rooms
*/
exports.addVenueRoom = async (req, res) => {
  const venueId = req.params.id;
  const venue = await Venue.findById(venueId)
  res.render('addVenueRooms', { venue })
}

/**
 * POST /venues/add-room/:id
 * photographer-add-rooms
*/
exports.addVenueRoomOnPost = async (req, res) => {
  try {
    const venueId = req.params.id;
    const { room_name, room_price } = req.body;

    const roomsToAdd = [];

    if (!Array.isArray(room_name)) {
      // If package_name is not an array, convert it into an array
      roomsToAdd.push({ room_name, room_price: room_price || 0 });
    } else {
      // If package_name is an array, iterate through each element
      for (let i = 0; i < room_name.length; i++) {
        const roomName = room_name[i];
        const roomPrice = room_price[i] || 0;
        roomsToAdd.push({ room_name: roomName, room_price: roomPrice });
      }
    }

    await Venue.findOneAndUpdate(
      { _id: venueId },
      {
        $push: {
          rooms: {
            $each: roomsToAdd
          }
        }
      }
    );

    req.flash('infoSubmit', 'Room Added!')
    res.redirect('/venues/edit/' + `${venueId}`)

  }
  catch (error) {
    req.flash('infoErrors', error);
    res.status(500).send(error)
  }
}


/**
 * POST /venues/del-room/:id/:pid
 * photographer-rooms-delete
*/
exports.delVenueRoom = async (req, res) => {
  try {
    const venueId = req.params.id;
    const roomId = req.params.pid;
    const venue = await Venue.findById(venueId);

    venue.rooms.pull(roomId)

    await venue.save();

    req.flash('infoSubmit', 'Room deleted successfully.')
    res.redirect('/venues/edit/' + `${venueId}`);

  }
  catch (err) {
    req.flash('infoErrors', error);
    res.status(500).send(err)
  }
}

/**
 * GET /venues/add-decor/:id
 * photographer-add-decor
*/
exports.addVenueDecor = async (req, res) => {
  const venueId = req.params.id;
  const venue = await Venue.findById(venueId)
  res.render('addVenueDecor', { venue })
}

/**
 * POST /venues/add-package/:id
 * photographer-add-halls
*/
exports.addVenueDecorOnPost = async (req, res) => {
  try {
    const venueId = req.params.id;
    const { event, decor_price } = req.body;

    const decorsToAdd = [];

    if (!Array.isArray(event)) {
      // If package_name is not an array, convert it into an array
      decorsToAdd.push({ event, decor_price: decor_price || 0 });
    } else {
      // If package_name is an array, iterate through each element
      for (let i = 0; i < event.length; i++) {
        const event = event[i];
        const decorPrice = decor_price[i] || 0;
        decorsToAdd.push({ event: event, decor_price: decorPrice });
      }
    }

    await Venue.findOneAndUpdate(
      { _id: venueId },
      {
        $push: {
          decor: {
            $each: decorsToAdd
          }
        }
      }
    );

    req.flash('infoSubmit', 'Decoration price has been registered.')
    res.redirect('/venues/edit/' + `${venueId}`)

  }
  catch (error) {
    req.flash('infoErrors', error);
    res.status(500).send(error)
  }
}


/**
 * POST /venues/del-package/:id/:pid
 * photographer-packages-delete
*/
exports.delVenueDecor = async (req, res) => {
  try {
    const venueId = req.params.id;
    const decorId = req.params.pid;
    const venue = await Venue.findById(venueId);

    venue.decor.pull(decorId)

    await venue.save();

    req.flash('infoSubmit', 'Decoration price deleted successfully.')
    res.redirect('/venues/edit/' + `${venueId}`);

  }
  catch (err) {
    req.flash('infoErrors', err);
    res.status(500).send(err)
  }
}

/**
 * POST /delete-venue/:id
 * photographer-delete
*/
exports.deleteVenue = async (req, res) => {
  try {
    const venueId = req.params.id;
    const venue = await Venue.findByIdAndDelete(venueId);
    res.redirect('/vendors');

  }
  catch (err) {
    res.status(500).send(err)
  }
}




/**---------------------------------------------------------photographer------------------------------------------------------ */

/**
 * GET / photographer
 * 
*/
exports.explorePhotographers = async (req, res) => {
  try {
    const queryObj = {}

    // Handle budget range filtering
    if (req.query.photoVideo) {
      const budgetRange = req.query.photoVideo.split('-');
      const minAmount = parseInt(budgetRange[0]);
      const maxAmount = parseInt(budgetRange[1]);

      // Create budgetObject based on input conditions
      const budgetObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        budgetObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        budgetObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        budgetObject.$gte = minAmount;
        budgetObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.photoVideo = budgetObject;
    }
    // Handle rating range filtering
    if (req.query.averageRating) {
      const ratingRange = req.query.averageRating.split('-');
      const minAmount = parseInt(ratingRange[0]);
      const maxAmount = parseInt(ratingRange[1]);

      // Create budgetObject based on input conditions
      const ratingObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        ratingObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        ratingObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        ratingObject.$gte = minAmount;
        ratingObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.averageRating = ratingObject;
    }
    // Handle search filtering
    if (req.query.search) {
      const searchTerm = req.query.search;
      const regex = new RegExp(searchTerm, 'i');
      queryObj.$or = [
        { name: regex }, // Search in the 'name' field
        { location: regex }
      ];
    }

    if (req.query.services) {
      const services = req.query.services.split(','); // assuming services are comma-separated
      queryObj.services = { $in: services };
    }

    console.log(req.query.search)
    console.log(queryObj)

    await Photographer.find(queryObj).then(photographers => {
      res.render('photographers',
        {
          photographerList: photographers
        })
    })
  }

  catch (error) {
    res.status(500).send(error)
  }
}
/**
 * GET /photographers/:id
 * Photographer
*/
exports.explorePhotographer = async (req, res) => {
  try {
    let photographerId = req.params.id;
    await Photographer.findById(photographerId).then(photographer => {
      const ratings = photographer.ratings;
      const totalRatings = ratings.reduce((sum, rating) => sum + rating.rate, 0);
      const avgRatingUnRounded = Math.round((totalRatings / ratings.length) * 10) / 10;
      const avgRating = avgRatingUnRounded.toFixed(1);
      res.render('photographer_details', { photographer: photographer, avgRating: avgRating });
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}

/**
 * POST / /photographer/:id
 * rate photographer
*/
exports.ratePhotographer = async (req, res) => {
  try {
    const photographerId = req.params.id
    const photographer = await Photographer.findById(photographerId);
    const rating = req.body.rating;
    const ratings = { user_id: "pqr", rate: rating }
    photographer.ratings.push(ratings)
    photographer.save();

    const rates = photographer.ratings;
    const totalRatings = rates.reduce((sum, rating) => sum + rating.rate, 0);
    const avgRatingUnRounded = Math.round((totalRatings / rates.length) * 10) / 10;
    const avgRating = avgRatingUnRounded.toFixed(1);
    console.log(avgRating)

    await Photographer.findOneAndUpdate({ _id: photographerId }, {
      $set: {
        averageRating: avgRating
      }
    })

    console.log(photographer)
    console.log("rated")
    res.redirect("/photographers/" + `${photographerId}`);
  }
  catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" })
  }
}


/**
 * GET /register-photographer
 * photographer-registration
*/
exports.registerPhotographer = async (req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('photographer_details_form', { title: 'Dream Stories - Organisation Registration ', infoErrorsObj, infoSubmitObj });
}

/**
 * POST /register-photographer
 * register on post
*/

exports.registerPhotographerOnPost = async (req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No Files where uploaded.');
      console.log(req.files)
    } else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;
      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;
      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.satus(500).send(err);
      })

    }


    // const profileImage = req.file.image;
    // const images = req.files.photos;

    // // Handle profile image (if uploaded)
    // let profileImageFilename = null;
    // if (profileImage) {
    //   profileImageFilename = profileImage.filename;
    // }

    // // Handle multiple images (if uploaded)
    // const imageDocs = [];
    // if (images) {
    //   for (const image of images) {
    //     const img = new Image({ filename: image.filename });
    //     imageDocs.push(img);
    //   }

    //   console.log(req.headers);
    //   console.log(req.body);
    //   console.log(req.files);
    // }



    const package_names = Array.isArray(req.body.package_name) ? req.body.package_name : [req.body.package_name];
    const package_prices = Array.isArray(req.body.package_price) ? req.body.package_price : [req.body.package_price];

    const packages = [];

    for (let i = 0; i < Math.max(package_names.length, package_prices.length); i++) {
      const packageName = package_names[i] || ''; // Use empty string if package name doesn't exist
      const packagePrice = package_prices[i] || 0; // Use 0 if package price doesn't exist
      packages.push({ package_name: packageName, package_price: packagePrice });
    }


    const newPhotographer = new Photographer({
      name: req.body.name,
      address: req.body.address,
      location: req.body.location,
      addressUrl: req.body.addressUrl,
      about: req.body.about,
      contact: req.body.contact,
      email: req.body.email,
      services: req.body.services,
      since: req.body.since,
      paymentTerms: req.body.payment,
      travelCost: req.body.travel,
      mostBooked: req.body.most_booked,
      deliveryTime: req.body.delivery,
      budget: req.body.budget,
      smallFunction: req.body.smallfunc,
      photo: req.body.photo,
      photoVideo: req.body.photo_vdo,
      albums: req.body.albums,
      instaUrl: req.body.instaUrl,
      fbUrl: req.body.fbUrl,
      profilePhoto: newImageName
    });

    newPhotographer.packages = packages;
    await newPhotographer.save();

    req.flash('infoSubmit', 'Organisation has been registered.')
    res.redirect('/register-photographer');
  } catch (error) {
    req.flash('infoErrors', error);
    console.log(error)
    res.redirect('/register-photographer');
  }
}


/**
 * GET / /photographers/edit/:id
 * photographer-packages
*/
exports.photographersEdit = async (req, res) => {
  try {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    const photographerId = req.params.id;
    const photographer = await Photographer.findById(photographerId)
    res.render('photographer_edit', { photographer, infoErrorsObj, infoSubmitObj })

  }
  catch (err) {
    res.status(500).send(err)
  }
}

/**
 * POST /photographers/edit/:id
 * photographer-updation
*/

exports.photographersEditPost = async (req, res) => {
  try {
    const photographerId = req.params.id;

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No Files where uploaded.');
      console.log(req.files)
    } else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;
      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;
      imageUploadFile.mv(uploadPath, function (err) {
        if (err) {
          console.error(err);
          return res.status(500).send(err);
        }
        console.log('File uploaded successfully!');
      })

    }

    const package_names = Array.isArray(req.body.package_name) ? req.body.package_name : [req.body.package_name];
    const package_prices = Array.isArray(req.body.package_price) ? req.body.package_price : [req.body.package_price];

    const packages = [];

    for (let i = 0; i < Math.max(package_names.length, package_prices.length); i++) {
      const packageName = package_names[i] || ''; // Use empty string if package name doesn't exist
      const packagePrice = package_prices[i] || 0; // Use 0 if package price doesn't exist
      packages.push({ package_name: packageName, package_price: packagePrice });
    }


    const photographer = await Photographer.findOneAndUpdate({ _id: photographerId }, {
      $set: {
        name: req.body.name,
        address: req.body.address,
        location: req.body.location,
        addressUrl: req.body.addressUrl,
        about: req.body.about,
        contact: req.body.contact,
        email: req.body.email,
        services: req.body.services,
        since: req.body.since,
        paymentTerms: req.body.payment,
        travelCost: req.body.travel,
        mostBooked: req.body.most_booked,
        deliveryTime: req.body.delivery,
        budget: req.body.budget,
        smallFunction: req.body.smallfunc,
        photo: req.body.photo,
        photoVideo: req.body.photo_vdo,
        albums: req.body.albums,
        instaUrl: req.body.instaUrl,
        fbUrl: req.body.fbUrl,
        profilePhoto: newImageName
      }
    },
      { upsert: true, new: true }
    )

    photographer.save();
    req.flash('infoSubmit', 'Photographer details updated!')
    res.redirect('/photographers/edit/' + `${photographerId}`)

  }
  catch (err) {
    res.status(500).send(err)
  }
}


/**
 * GET /photographers/add-package/:id 
 * photographer-add-packages 
*/
exports.addPhotographersPackages = async (req, res) => {
  const photographerId = req.params.id;
  const photographer = await Photographer.findById(photographerId)
  res.render('addPhotographerPackage', { photographer })
}

/**
 * POST /photographers/add-package/:id
 * photographer-add-packages
*/
exports.addPhotographersPackagesOnPost = async (req, res) => {
  try {
    const photographerId = req.params.id;
    const { package_name, package_price } = req.body;

    const packagesToAdd = [];

    if (!Array.isArray(package_name)) {
      // If package_name is not an array, convert it into an array
      packagesToAdd.push({ package_name, package_price: package_price || 0 });
    } else {
      // If package_name is an array, iterate through each element
      for (let i = 0; i < package_name.length; i++) {
        const name = package_name[i];
        const price = package_price[i] || 0;
        packagesToAdd.push({ package_name: name, package_price: price });
      }
    }

    await Photographer.findOneAndUpdate(
      { _id: photographerId },
      {
        $push: {
          packages: {
            $each: packagesToAdd
          }
        }
      }
    );

    req.flash('infoSubmit', 'Pacakge Added!')
    res.redirect('/photographers/edit/' + `${photographerId}`)

  }
  catch (error) {
    req.flash('infoErrors', error);
    res.status(500).send(error)
  }
}


/**
 * POST /photographers/del-package/:id/:pid
 * photographer-packages-delete
*/
exports.delPhotographersPackage = async (req, res) => {
  try {
    const photographerId = req.params.id;
    const packageId = req.params.pid;
    const photographer = await Photographer.findById(photographerId);

    photographer.packages.pull(packageId)

    await photographer.save();

    req.flash('infoSubmit', 'Package deleted successfully!')
    res.redirect('/photographers/edit/' + `${photographerId}`);

  }
  catch (err) {
    req.flash('infoErrors', err);
    res.status(500).send(err)
  }
}


/**
 * POST /delete-photographer/:id
 * photographer-delete
*/
exports.deletePhotographer = async (req, res) => {
  try {
    const photographerId = req.params.id;
    const photographer = await Photographer.findByIdAndDelete(photographerId);

    // await photographer.save();

    res.redirect('/vendors');

  }
  catch (err) {
    res.status(500).send(err)
  }
}

/**--------------------------------------------------------entertainer------------------------------------------------------ */


/**
 * GET / entertainers
 * 
*/
exports.exploreEntertainers = async (req, res) => {
  try {
    const queryObj = {}

    // Handle budget range filtering
    if (req.query.budget) {
      const budgetRange = req.query.budget.split('-');
      const minAmount = parseInt(budgetRange[0]);
      const maxAmount = parseInt(budgetRange[1]);

      // Create budgetObject based on input conditions
      const budgetObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        budgetObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        budgetObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        budgetObject.$gte = minAmount;
        budgetObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.budget = budgetObject;
    }
    // Handle experience filtering
    if (req.query.experience) {
      const experienceRange = req.query.experience.split('-');
      const minAmount = parseInt(experienceRange[0]);
      const maxAmount = parseInt(experienceRange[1]);

      // Create budgetObject based on input conditions
      const experienceObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        experienceObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        experienceObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        experienceObject.$gte = minAmount;
        experienceObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.experience = experienceObject;
    }
    // Handle rating range filtering
    if (req.query.averageRating) {
      const ratingRange = req.query.averageRating.split('-');
      const minAmount = parseInt(ratingRange[0]);
      const maxAmount = parseInt(ratingRange[1]);

      // Create budgetObject based on input conditions
      const ratingObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        ratingObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        ratingObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        ratingObject.$gte = minAmount;
        ratingObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.averageRating = ratingObject;
    }
    // Handle search filtering
    if (req.query.search) {
      const searchTerm = req.query.search;
      const regex = new RegExp(searchTerm, 'i');
      queryObj.$or = [
        { name: regex }, // Search in the 'name' field
        { location: regex }
      ];
    }

    if (req.query.services) {
      const services = req.query.services.split(','); // assuming services are comma-separated
      queryObj.services = { $in: services };
    }


    await Entertainer.find(queryObj).then(entertainers => {
      res.render('entertainers',
        {
          entertainerList: entertainers
        })
    })
  }

  catch (error) {
    res.status(500).send(error)
  }
}


/**
 * GET /entertainers/:id
 * Entertainer
*/
exports.exploreEntertainer = async (req, res) => {
  try {
    let entertainerId = req.params.id;
    await Entertainer.findById(entertainerId).then(entertainer => {
      const ratings = entertainer.ratings;
      const totalRatings = ratings.reduce((sum, rating) => sum + rating.rate, 0);
      const avgRatingUnRounded = Math.round((totalRatings / ratings.length) * 10) / 10;
      const avgRating = avgRatingUnRounded.toFixed(1);
      res.render('entertainer_details', { entertainer: entertainer, avgRating: avgRating });
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}


exports.rateEntertainer = async (req, res) => {

  try {
    const entertainerId = req.params.id
    const entertainer = await Entertainer.findById(entertainerId);
    const rating = req.body.rating;
    const ratings = { user_id: "pqr", rate: rating }
    entertainer.ratings.push(ratings)
    entertainer.save();

    const rates = entertainer.ratings;
    const totalRatings = rates.reduce((sum, rating) => sum + rating.rate, 0);
    const avgRatingUnRounded = Math.round((totalRatings / rates.length) * 10) / 10;
    const avgRating = avgRatingUnRounded.toFixed(1);
    console.log(avgRating)

    await Entertainer.findOneAndUpdate({ _id: entertainerId }, {
      $set: {
        averageRating: avgRating
      }
    })

    res.redirect("/entertainers/" + `${entertainerId}`);
  }
  catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" })
  }
}


/**
 * GET /register-entertainer
 * entertainer-registration
*/
exports.registerEntertainer = async (req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('entertainer_details_form', { title: 'Dream Stories - Organisation Registration ', infoErrorsObj, infoSubmitObj });
}

/**
 * POST /register-entertaner
 * register on post
*/

exports.registerEntertainerOnPost = async (req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No Files where uploaded.');
      console.log(req.files)
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;


      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.satus(500).send(err);
      })

    }
    const events = req.body.event;
    const prices = req.body.price;

    const ent_prices = [];

    loop1: for (let elem1 of events) {
      for (let elem2 of prices) {
        ent_prices.push({ event: elem1, price: elem2 })
        continue loop1;
      }
    }


    const newEntertainer = new Entertainer({
      name: req.body.name,
      address: req.body.address,
      location: req.body.location,
      addressUrl: req.body.addressUrl,
      about: req.body.about,
      contact: req.body.contact,
      email: req.body.email,
      services: req.body.services,
      since: req.body.since,
      payment_terms: req.body.payment,
      experience: req.body.experience,
      budget: req.body.budget,
      travelCost: req.body.travel,
      instaUrl: req.body.instaUrl,
      fbUrl: req.body.fbUrl,
      profilePhoto: newImageName
    });

    newEntertainer.prices = ent_prices;
    await newEntertainer.save();

    req.flash('infoSubmit', 'Organisation has been registered.')
    res.redirect('/register-entertainer');
  } catch (error) {
    req.flash('infoErrors', error);
    console.log(error)
    res.redirect('/register-entertainer');
  }
}



/**
 * GET / /entertainers/edit/:id
 * entertainer-details-update
*/
exports.entertainersEdit = async (req, res) => {
  try {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    const entertainerId = req.params.id;
    const entertainer = await Entertainer.findById(entertainerId)
    res.render('entertainer_edit', { entertainer, infoErrorsObj, infoSubmitObj })

  }
  catch (err) {
    res.status(500).send(err)
  }
}

/**
 * POST /entertainers/edit/:id
 * entertainer-updation
*/

exports.entertainersEditPost = async (req, res) => {
  try {
    const entertainerId = req.params.id;

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No Files where uploaded.');
      console.log(req.files)
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;


      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.satus(500).send(err);
      })

    }

    const events = Array.isArray(req.body.event) ? req.body.event : [req.body.event];
    const eventPrices = Array.isArray(req.body.price) ? req.body.price : [req.body.price];

    const prices = [];

    for (let i = 0; i < Math.max(events.length, eventPrices.length); i++) {
      const event = events[i] || ''; // Use empty string if package name doesn't exist
      const eventPrice = eventPrices[i] || 0; // Use 0 if package price doesn't exist
      prices.push({ event: event, price: eventPrice });
    }


    const entertainer = await Entertainer.findOneAndUpdate({ _id: entertainerId }, {
      $set: {
        name: req.body.name,
        address: req.body.address,
        location: req.body.location,
        addressUrl: req.body.addressUrl,
        about: req.body.about,
        contact: req.body.contact,
        email: req.body.email,
        services: req.body.services,
        since: req.body.since,
        payment_terms: req.body.payment,
        experience: req.body.experience,
        budget: req.body.budget,
        travelCost: req.body.travel,
        instaUrl: req.body.instaUrl,
        fbUrl: req.body.fbUrl,
        profilePhoto: newImageName
      }
    },
      { upsert: true, new:true }
    )

    req.flash('infoSubmit', 'Entertainer details Updated!')
    res.redirect('/entertainers/edit/' + `${entertainerId}`)

  }
  catch (err) {
    res.status(500).send(err)
  }
}


/**
 * GET /entertainers/add-price/:id
 * entertainer-add-prices
*/
exports.addEntertainerPrice = async (req, res) => {
  const entertainerId = req.params.id;
  const entertainer = await Entertainer.findById(entertainerId)
  res.render('addEntertainerPrice', { entertainer })
}

/**
 * POST /entertainers/add-price/:id
 * entertainer-add-prices
*/
exports.addEntertainerPriceOnPost = async (req, res) => {
  try {
    const entertainerId = req.params.id;
    const { event, price } = req.body;

    const pricesToAdd = [];

    if (!Array.isArray(event)) {
      // If package_name is not an array, convert it into an array
      pricesToAdd.push({ event, price: price || 0 });
    } else {
      // If package_name is an array, iterate through each element
      for (let i = 0; i < event.length; i++) {
        const eventName = event[i];
        const eventPrice = price[i] || 0;
        pricesToAdd.push({ event: eventName, price: eventPrice });
      }
    }

    await Entertainer.findOneAndUpdate(
      { _id: entertainerId },
      {
        $push: {
          prices: {
            $each: pricesToAdd
          }
        }
      }
    );

    req.flash('infoSubmit', 'Price Registered!')
    res.redirect('/entertainers/edit/' + `${entertainerId}`)

  }
  catch (error) {
    req.flash('infoErrors', error);
    res.status(500).send(error)
  }
}


/**
 * POST /entertainers/del-price/:id/:pid
 * enteratiner-prices-delete
*/
exports.delEntertainerPrice = async (req, res) => {
  try {
    const entertainerId = req.params.id;
    const priceId = req.params.pid;
    const entertainer = await Entertainer.findById(entertainerId);

    entertainer.prices.pull(priceId)

    await entertainer.save();

    req.flash('infoSubmit', 'Price details deleted successfully.')
    res.redirect('/entertainers/edit/' + `${entertainerId}`);

  }
  catch (err) {
    req.flash('infoErrors', err);
    res.status(500).send(err)
  }
}


/**
 * POST /delete-entertainer/:id
 * entertainer-delete
*/
exports.deleteEntertainer = async (req, res) => {
  try {
    const entertainerId = req.params.id;
    const entertainer = await Entertainer.findByIdAndDelete(entertainerId);

    res.redirect('/');

  }
  catch (err) {
    res.status(500).send(err)
  }
}
