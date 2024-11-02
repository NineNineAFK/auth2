const express = require("express");
const app= express();
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors"); 
const {restrictToLoggedInUserOnly} = require("./middlewares/auth");

const passport = require("./config/passport");

// CORS Configuration
app.use(cors({
  origin: 'https://auth2-ten.vercel.app', // Frontend URL
  credentials: true, // Allow credentials such as cookies to be sent
}));

const router= express.Router();


const staticRouter= require("./routes/staticRouter");
const authRouter = require("./routes/auth");
const openRouter = require("./routes/openRouter");
//const revewRouter = require("./routes/staticRouter")
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(cookieParser());

app.use(
    session({
      secret: "Aaditya@3737",
      resave: false,
      saveUninitialized: false,
    })
  );

app.use(passport.initialize());
app.use(passport.session());


app.use("/home", restrictToLoggedInUserOnly, staticRouter);

app.use("/auth", authRouter);
app.use("/open", openRouter);
app.set("view engine","ejs");
app.set("views", path.resolve("./views"));



const{connectMongoDB}= require('./connect')
connectMongoDB('mongodb+srv://Aaditya:admin@cluster0.kxn151h.mongodb.net/D3');

//app.listen(3000);