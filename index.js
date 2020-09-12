const express = require('express');
const app = express();
const { pool }  = require('./dbConfig');
const bcrypt = require ("bcrypt");
const session = require ('express-session');
const flash = require ('express-flash');

const PORT = process.env.PORT || 3000;

//Middleware
//tell app to to use view engine to render EJS files
app.set("view engine", "ejs");

//Middleware to send from frontend to server
app.use(express.urlencoded({ extended: false }));

//Encrypt info stored in session
app.use(session({
  secret: 'secret',
//save session variables?
  resave: false,
//save session details if no value
  saveUninitialized: false

})

);
//display flash messages
app.use(flash());

//Routes
app.get('/', (req, res) => {
  res.render('index')

});

app.get('/users/register', (req, res) => {
  res.render("register");
});


app.get('/users/login', (req, res) => {
  res.render("login");
});


app.get('/users/dashboard', (req, res) => {
  res.render("dashboard", { user: "Rhonda" });
});


app.post("/users/register", async (req, res) => {
  let { name, email, password, password2} = req.body;

  console.log({
    name,
    email,
    password,
    password2
  });

  let errors = [];

  //validation
  if(!name || !email || !password || !password2){
    errors.push({ message: "Please enter all fields"});
  }

  if(password.length < 6){
    errors.push({message: "Password should be at least 6 characters"});
  }

  if(password != password2) {
    errors.push({message: "Passwords do not match"});
  }

  if(errors.length > 0){
    res.render("register", { errors });
  }else{

    //Form validation has passed
    let hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    //see if user exist
    pool.query(
        `SELECT * FROM users 
        WHERE email = $1`,
         [email], 
         (error, results)=> {
          if (error) {
            throw error;
          }
          console.log(results.rows);

          if (results.rows.length > 0) {
            errors.push({ message: "Email already registered"});
            console.log(errors);
            res.render("register", { errors });
          }else{
            pool.query(
              `INSERT INTO users (name, email password)
              VALUES ($1, $2, $3)
              RETURNING id, password`, 
              [name, email, hashedPassword], 
              (err, results)=> {
                console.log(error);
                if (error) {
                  throw error;
                }
              console.log(results.row);
              req.flash('success_msg', "You are now registered. Please log in")
              res.redirect("/users/login");
            }
          );
        }
      }
    );
  }
});


app.listen(PORT, () => {
  console.log (`Server Up and running ${PORT}`);
});
