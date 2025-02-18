require("dotenv").config();

const express = require("express");
const app = express();
const PORT = 2395 || process.env.PORT;
const db = require("./models");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");

const isProduction = process.env.NODE_ENV === "production";

const sessionStore = new SequelizeStore({
  db: db.sequelize,
  checkExpirationInterval: 15 * 60 * 1000,
  expiration: 7 * 24 * 60 * 60 * 1000,
});

app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: isProduction ? sessionStore : undefined,
    resave: false,
    saveUninitialized: isProduction,
    cookie: {
      secure: isProduction,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(cookieParser());
app.use(flash());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(require("./routes"));

console.log("Waiting for database connection...");
db.sequelize
  .sync({
    force: false,
    alter: process.env.NODE_ENV === "production",
    benchmark: true,
  })
  .then(({ options, config }) => {
    console.log(`Database connection sucessfull!`);
    console.table({
      dialect: options.dialect,
      database: config.database,
      database_user: config.username,
      database_host: config.host,
      database_protocol: config.protocol,
      database_port: config.port,
    });
    if (isProduction) {
      sessionStore.sync().then(() => console.log("Session store synced!"));
    }
    app.listen(PORT, () => {
      console.log(`Server is Up and Running on http://localhost:${PORT}/`);
    });
  })
  .catch((error) => console.log(error));
