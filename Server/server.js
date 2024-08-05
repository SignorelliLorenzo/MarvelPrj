require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const componentRoute = require("./Routes/components");
const userRoute = require("./Routes/users");
const User = require("./Models/User.js");
const cors= require("cors");

const app = express();
const PORT = process.env.PORT || 2000;



// Middleware di protezione
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(403).json({ status: "fail", message: "Not authorized to access this route" });
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(403).json({ status: "fail", message: "The user belonging to this token does no longer exist." });
    }
    req.currentUser = currentUser;
    next();
  } catch (err) {
    console.error(err);
    return res.status(403).json({ status: "fail", message: "Not authorized to access this route" });
  }
};

// Connessione al database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));



// Controllo server attivo
app.get("/", (req, res) => res.send(`Node and express server running on port ${PORT}`));
app.use(express.json()); // Configure body-parser middleware
app.use(cors({ origin: "http://localhost:3000" }));
// Rotte
app.use("/auth", userRoute);
app.use("/api", protect, componentRoute);

// Swagger set up
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API Information',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./Routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Avvio del server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
