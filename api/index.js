console.clear();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const authRoute = require("./routes/auth.route");
const port = process.env.PORT || 4000;
const helmet = require("helmet");
const morgan = require("morgan");
const passport= require('passport')
const cookieSession= require('cookie-session')
const passportSetup= require('./passport-setup')
require("dotenv").config();

app.use(cookieSession({
  name:"session",
  keys:["fcc"],
  maxAge:24*60*60*100
}))

app.use(passport.initialize())
app.use(passport.session())
//middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);
app.use(helmet());
app.use(morgan("common"));

app.use("/auth", authRoute);

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => console.log(`server started at ${port}`));
    console.log("connected");
  })
  .catch((err) => console.log(err));
