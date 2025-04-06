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
    },
  },
});
