require("dotenv").config();

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
const cleanupFKConstraints = require("./utils/cleanupFKConstraints");

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
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(404).render("error.ejs", { error: "" });
});

console.log("Waiting for database connection...");

// Use migrations for schema changes, not alter sync
// Run migrations with: npx sequelize-cli db:migrate
db.sequelize
  .authenticate()
  .then(async () => {
    console.log(`Database connection successful!`);
    
    // Sync without alter - use migrations for schema changes
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
