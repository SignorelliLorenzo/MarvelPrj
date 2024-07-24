require("dotenv").config();
const Componentuser = require("./routes/users.js");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./models/user.js");
var cors = require("cors");
const RequestModel = require("./models/requests.js");
const LinkerModel = require("./models/linker.js");
const app = express();
const PORT = process.env.PORT || 2000;
const componentRoute = require("./routes/component");
const jwt = require("jsonwebtoken");
const UAParser = require('ua-parser-js');
const myCache =  require('./controllers/cache.js');


const protect = async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(403)
      .json({ status: "fail", message: "Not authorized to access this route" });
  }

  try {
    // 2) Verification token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(403).json({
        status: "fail",
        message: "The user belonging to this token does no longer exist.",
      });
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (err) {
    console.error(err);
    return res.status(403).json({
      status: "fail",
      message: "Not authorized to access this route",
    });
  }
};

/// DATABASE CONNECTION"
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

//middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

//check running
app.get("/", (req, res) =>
  res.send(`Node and express server running on port ${process.env.PORT}`)
);
app.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const Linker = await LinkerModel.findOne({Shorturl:id});
    if (!Linker) {
      return res.status(404).json({ error: "Link not active or none existent" });
    }
    let parser = new UAParser(req.headers['user-agent']);
    let deviceType = parser.getOS().name;
    
    if (deviceType === 'iOS') deviceType = 'iOS';
    else if (deviceType === 'Android') deviceType = 'Android';
    else deviceType = 'Altro';
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (ip === "::1" || ip === "127.0.0.1") {
     ip = "localhost";
    }
    let visit = new RequestModel({
      Date: new Date(),
      ShortUrl: Linker.Shorturl,
      device: deviceType,
      ip: ip,
    });
    console.log(visit)
    await visit.save();
    //res.redirect("Linker.url");
    const cacheKey = `${Linker.Shorturl}-data`;
    myCache.del(cacheKey);
    res.status(200).json( visit );
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occurred" });
  }
});

app.use("/user", Componentuser);

app.use("/api", protect, componentRoute);

// Specify a port at which your server should run
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));