describe("Dashboard Page", () => {
  beforeEach(() => {
    cy.setCookie("aToken", Cypress.env("A_TOKEN"));
    cy.viewport(1280, 720);
  });

  it("Should load Dashboard page", () => {
    cy.visit(Cypress.env("BASE_URL") + "/dashboard");
    cy.url().should("include", "/dashboard");
    cy.contains("Admin Dashboard").should("exist");
    cy.contains(Cypress.env("USERNAME")).should("exist");
  });
});
