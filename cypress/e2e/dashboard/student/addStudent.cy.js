describe("All Students page", () => {
  beforeEach(() => {
    cy.setCookie("aToken", Cypress.env("A_TOKEN"));
    cy.viewport(1080, 720);
    cy.visit(Cypress.env("BASE_URL") + "/dashboard");
    cy.get("[data-testId=addStudentNavLink]").click();
  });

  it("Should load All Students page", () => {
    cy.contains("Add Student");
    cy.url().should("include", "/add-student");
    cy.get("[data-testId=allStudentsLink]").click();
    cy.url().should("include", "/all-students");
    cy.go("back");
    cy.url().should("include", "/add-student");
    // cy.get("#example tbody tr").should("exist");
  });
});
