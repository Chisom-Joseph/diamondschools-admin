require("dotenv").config();

// ─── Async error safety net ───────────────────────────────────────────────────
// Express 4 does not catch errors thrown inside async route handlers.
// This patches Express's internal Layer so that any unhandled rejection is
// automatically forwarded to next(err), triggering the global error handler
// below instead of leaving the request hanging (which causes nginx 504s).
// This is the same technique used by the express-async-errors package.
const Layer = require("express/lib/router/layer");
const originalHandle = Layer.prototype.handle_request;
Layer.prototype.handle_request = function handle_request_with_async(
  req,
  res,
  next
) {
  try {
    const result = originalHandle.call(this, req, res, next);
    if (result && typeof result.catch === "function") {
      result.catch(next);
    }
  } catch (err) {
    next(err);
  }
};
// ─────────────────────────────────────────────────────────────────────────────

const express = require("express");
const app = express();
const PORT = process.env.PORT || 2395;
const db = require("./models");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const seedFeatures = require("./utils/seedFeatures");
const seedSiteSettings = require("./utils/seedSiteSettings");

const isProduction = process.env.NODE_ENV === "production";

const sessionStore = new SequelizeStore({
  db: db.sequelize,
  checkExpirationInterval: 15 * 60 * 1000,
  expiration: 7 * 24 * 60 * 60 * 1000,
});

if (!process.env.SESSION_SECRET) {
  console.error("❌ SESSION_SECRET is not set in environment variables!");
  process.exit(1);
}

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
// 404 — no route matched
app.use((req, res) => {
  res.status(404).render("error.ejs", { error: { statusCode: 404, title: "Page Not Found", message: "The page you requested does not exist." } });
});

// Global error handler — catches errors forwarded via next(err)
// Must have exactly 4 parameters so Express recognises it as an error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || err.statusCode || 500;
  res.status(status).render("error.ejs", {
    error: {
      statusCode: status,
      title: "Internal Server Error",
      message: "Something went wrong. Please try again later.",
    },
  });
});

console.log("Waiting for database connection...");

db.sequelize
  .authenticate()
  .then(async () => {
    console.log(`Database connection successful!`);
    
    return db.sequelize.sync({
      force: false,
      alter: false,
    });
  })
  .then(async () => {
    const config = db.sequelize.config;
    console.table({
      dialect: config.dialect,
      database: config.database,
      database_user: config.username,
      database_host: config.host,
    });

    if (isProduction) {
      sessionStore
        .sync()
        .then(() => console.log("Session store synced!"))
        .catch((error) => {
          console.error("❌ Failed to sync session store:", error);
          process.exit(1);
        });
    }
    app.listen(PORT, async () => {
      console.log(`Server is Up and Running on http://localhost:${PORT}/`);
      await seedFeatures();
      await seedSiteSettings();
    });
  })
  .catch((error) => {
    console.error("❌ DB Auth failed:");
    console.log(error);
    process.exit(1);
  });
