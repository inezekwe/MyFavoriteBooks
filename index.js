const express = require("express");
const { pool } = require("./dbconfig.js");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
require("dotenv").config();
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000;

const initializePassport = require("./passportConfig.js");

initializePassport(passport);

// Middleware

app.use(express.static(path.join(__dirname, "public")));

// Parses details from a form
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.use(
  session({
    // Key we want to keep secret which will encrypt all of our information
    secret: process.env.SESSION_SECRET,
    // Should we resave our session variables if nothing has changes which we don't
    resave: false,
    // Save empty value if there is no value which we do not want to do
    saveUninitialized: false
  })
);
// Function inside passport which initializes passport
app.use(passport.initialize());
// Store our variables to be persisted across the whole session. Works with app.use(Session) above
app.use(passport.session());
app.use(flash());

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/users/register", checkAuthenticated, (req, res) => {
  res.render("register.ejs");
});

app.get("/users/login", checkAuthenticated, (req, res) => {
  // flash sets a messages variable. passport sets the error message
  console.log(req.session.flash.error);
  res.render("login.ejs");
});

app.get("/users/dashboard", checkNotAuthenticated, (req, res) => {
  console.log(req.isAuthenticated());
  res.render("dashboard", { user: req.user.name });
});

app.get("/users/logout", (req, res) => {
  req.logout();
  res.render("index", { message: "You have logged out successfully" });
});

app.post("/users/register", async (req, res) => {
  let { name, email, password, password2 } = req.body;

  let errors = [];

  console.log({
    name,
    email,
    password,
    password2
  });

  if (!name || !email || !password || !password2) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password must be a least 6 characters long" });
  }

  if (password !== password2) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    res.render("register", { errors, name, email, password, password2 });
  } else {
    hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    // Validation passed
    pool.query(
      `SELECT * FROM users
        WHERE email = $1`,
      [email],
      (error, results) => {
        if (error) {
          console.log(error);
        }
        console.log(results.rows);

        if (results.rows.length > 0) {
          return res.render("register", {
            message: "Email already registered"
          });
        } else {
          pool.query(
            `INSERT INTO users (name, email, password)
                VALUES ($1, $2, $3)
                RETURNING id, password`,
            [name, email, hashedPassword],
            (error, results) => {
              if (error) {
                console.log(error);
              }
              req.flash("success_msg", "You are now registered. Please log in");
              res.redirect("/users/login");
            }
          );
        }
      }
    );
  }
});

app.post(
  "/users/login",
  passport.authenticate("local", {
    successRedirect: "/users/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })
);

//Checks to see if book is already saved then saves book's ISBN to user's account
app.post('/users/save_book', checkNotAuthenticated, (req, res) => {
   let isbn = req.body.isbn;

   if(isbn) {
     pool.query(`SELECT isbn FROM faves WHERE user_id=${req.user.id} AND isbn='${isbn}'`)
        .then((response) => {
          console.log(response);
          if(response.rowCount == 0) {

            pool.query(`INSERT INTO faves(user_id, isbn) VALUES (${req.user.id}, '${isbn}')`)
              .then((results) => {
                console.log(results);
                res.send('Book saved successfully');
              })
              .catch((error) => {
                console.log(error);
                res.send("Could not save book");
              })

          }
          else {
            res.send("Book already saved");
          }
        })
     
   }
   else {
      res.send("Enter ISBN number");
   }
});

//Gets all the saved books linked to a user
app.get('/users/save_book', checkNotAuthenticated, (req, res) => {

    pool.query(`SELECT isbn FROM faves WHERE user_id=${req.user.id}`)
     .then((results) => {
       console.log(results);
       res.json(results.rows);
     })
     .catch((error) => {
       console.log(error);
       res.send("Could not retrieve bookshelf");
     })
  
});

//Deletes a book from user's account
app.delete('/users/remove_book/:isbn', checkNotAuthenticated, (req, res) => {
  let isbn = req.params.isbn;
  
  if(isbn) {
    pool.query(`DELETE FROM faves WHERE isbn='${isbn}' AND user_id=${req.user.id}`)
    .then((results) => {
      console.log(results);
      res.json(results.rowCount);
    })
    .catch((error) => {
      console.log(error);
      res.send("Could not remove book");
    })

  }
  
  res.send("Enter ISBN number");

});

//Adds a comment or diary entry to book on user's account
app.post('/users/add_comment', checkNotAuthenticated, (req, res) => {
  let comment = req.body.comment;
  let isbn = req.body.isbn;

  pool.query(`UPDATE faves SET comments='${comment}' WHERE user_id=${req.user.id} AND isbn='${isbn}'`)
    .then((results) => {
      console.log(results);
      res.redirect("/users/login");
    })
    .catch((error) => {
      console.log(error);
      res.end();
    })
});

//Gets diary entry of book from user's account
app.get('/users/comments/:isbn', checkNotAuthenticated, (req, res) => {
  let isbn = req.params.isbn;
  pool.query(`SELECT comments FROM faves WHERE user_id=${req.user.id} AND isbn='${isbn}'`)
    .then((results) => {
      console.log(results);
      res.json(results.rows);
    })
    .catch((error) => {
      console.log(error);
      res.send('Could not retrieve diary entry');
    })
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/dashboard");
  }
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users/login");
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});