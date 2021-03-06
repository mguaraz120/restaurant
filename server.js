require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
var passport = require("passport");
var session = require("express-session");
var bodyParser = require("body-parser");
var flash = require("connect-flash");

var db = require("./models");

var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser());
app.use(express.static("public"));

app.use(
  session({ secret: "thisisasecretshh", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.errorEmail = req.flash('errorEmail');
  res.locals.errorPassword = req.flash("errorPassword");
  next();
});

// var authRoute = require("./routes/auth.js")(app, passport);
require("./config/passport/passport.js")(passport, db.user);

// Handlebars
app.set("views", "./views");
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

var dishes = [
  {
    name: "Clam Chowder",
    price: 20,
    description:
      "Texas quahog clams in a clear broth with parsnips, salsify, carrots, celery, and potatoes. Served in a sourdough bread bowl."
  },
  {
    name: "Lobster Bisque",
    price: 22,
    description:
      "Corpus Christi lobster, onions, carrots, and celery in a saffron and cream bisque. Served in a sourdough bread bowl."
  },
  {
    name: "Wood Fired Oysters",
    price: 11,
    description:
      "Half dozen oysters roasted over an open wood fire. Served with cumin-chipotle sauce."
  },
  {
    name: "Pickled Pig's Feet",
    price: 11,
    description:
      "Four trotters pickled in lemon juice, vinegar, salt, hot pepper, onions, and cucumbers."
  },
  {
    name: "Corned Beef Sandwich",
    price: 11,
    description:
      "Clove-rubbed corned beef and coleslaw between two pieces of cowboy fry bread. Served with a side salad or fried potatoes."
  },
  {
    name: "Brisket Sandwich",
    price: 13,
    description:
      "Slow-smoked beef brisket cut into thin slices, pickled okra, wild onions, tomatoes, and black bread. Served with a side salad or fried potatoes."
  },
  {
    name: "Bison Burger ",
    price: 11,
    description:
      "Potato bun, lettuce, tomato, wild onions, and pepper jack cheese. Served with a side salad or fried potatoes."
  },
  {
    name: "Venison Burger",
    price: 13,
    description:
      "Potato bun, lettuce, tomato, wild onions, red wine marinade, and swiss cheese. Served with a side salad or fried potatoes."
  },
  {
    name: "Smoked Trout",
    price: 11,
    description:
      "Whole lake trout smoked with oyster sauce. Served with grilled leeks and salsify over a bed of creamed turnips."
  },
  {
    name: "Grilled Mackerel",
    price: 12,
    description:
      "Lemon and paprika-rubbed mackerel filet over a bed of succotash and mashed potatoes."
  },
  {
    name: "Chicken Pot Pie",
    price: 10,
    description:
      "Free-range chicken, carrots, celery, peas, and potatoes baked with rosemary and thyme. Bay leaf infused crust."
  },
  {
    name: "Wild Turkey Club",
    price: 11,
    description:
      "Thick cuts of roasted wild turkey, wild onions, lettuce, tomato, mayo, and black bread."
  }
];

// app.get("/menu/:name", function(req, res) {
//   for (var i = 0; i < dishes.length; i++) {
//     if (dishes[i].name === req.params.name) {
//       return res.render("menu", dishes[i]);
//     }
//   }
// });

// app.get("/menu", function(req, res) {
//   res.render("menu", { menu: menu });
// });

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: true };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

app.get("/", function(req, res) {
  res.render("index");
});

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  db.Dish.destroy({
    where: {},
    truncate: true
  });
  dishes.forEach(function(dish) {
    db.Dish.create(dish);
  });
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
