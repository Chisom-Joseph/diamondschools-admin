const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      BASE_URL: "http://localhost:2395",
      USERNAME: "xukato",
      PASSWORD: "1111111111",
      A_TOKEN:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJhMmI5NTgyLTBiMmQtNGU4NS04NjNmLWQ2NjY3NWZmYmIyNiIsImlhdCI6MTc0Mzk0MDE0OSwiZXhwIjoxNzQ0MTk5MzQ5fQ._smF7pTNwZwEqiVBFHG3KuBKqdzs_RiZgShY0OpU-tE",
    },
  },
});
