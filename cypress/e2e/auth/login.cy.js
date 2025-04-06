describe("Login Page", () => {
  beforeEach(() => {
    cy.visit(Cypress.env("BASE_URL") + "/auth/sign-in");
  });

  it("Should load Sign-in page", () => {
    cy.url().should("include", "/sign-in");
  });

  it("Should not allow empty form submission", () => {
    cy.get("[data-testId=loginButton]").click();
    cy.contains("Username is required.");
  });

  it("Should show error for invalid credentials", () => {
    cy.get("[data-testId=username]").type("invalidUser");
    cy.get("[data-testId=password]").type("invalidPassword");
    cy.get("[data-testId=loginButton]").click();
    cy.contains("Username, Email, or Password incorrect");
    cy.get("[data-testId=username]").should("have.value", "invalidUser");
    cy.get("[data-testId=password]").should("have.value", "");
  });

  it("Should allow valid credentials", () => {
    cy.get("[data-testId=username]").type(Cypress.env("USERNAME"));
    cy.get("[data-testId=password]").type(Cypress.env("PASSWORD"));
    cy.get("[data-testId=loginButton]").click();
    cy.url().should("include", "/dashboard");
  });
});
