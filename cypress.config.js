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
      USER: {
        firstName: "Gregory",
        middleName: "Edwards",
        lastName: "Landry",
        academicYear: "2023/2024",
        country: "AU",
        religion: "Christianity",
        dateOfBirth: "2013-12-02",
        gender: "male",
        class: "JSS1",
        address: "Quaerat ea doloremqu",
        guardian: {
          firstName: "Leila",
          middleName: "May",
          lastName: "Hill",
          email: "jani@mailinator.com",
          phoneNumber: "+1(881)409-5554",
          relationship: "Mother",
          occupation: "driver",
          address: "Quod sit molestiae ",
        },
      },
    },
  },
});
