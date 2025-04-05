describe("Login Page", () => {
  it("Should visit the Sign-in page", () => {
    cy.visit(Cypress.env("BASE_URL") + "/auth/sign-in");
    cy.url().should("include", "/sign-in");
  });
});
