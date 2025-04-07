describe("All Students page", () => {
  beforeEach(() => {
    cy.setCookie("aToken", Cypress.env("A_TOKEN"));
    cy.viewport(1080, 720);
    cy.visit(Cypress.env("BASE_URL") + "/dashboard");
    cy.get("[data-testId=allStudentsNavLink]").click();
  });

  it("Should load All Students page", () => {
    cy.contains("All Students");
    cy.url().should("include", "/all-students");
    cy.get("[data-testId=addStudentsLink]").click();
    cy.url().should("include", "/add-student");
    cy.go("back");
    cy.url().should("include", "/all-students");
    cy.get("#example tbody tr").should("exist");
  });
});
