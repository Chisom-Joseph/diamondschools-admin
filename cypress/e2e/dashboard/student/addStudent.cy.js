describe("All Students page", () => {
  beforeEach(() => {
    cy.setCookie("aToken", Cypress.env("A_TOKEN"));
    cy.viewport(1080, 720);
    cy.visit(Cypress.env("BASE_URL") + "/dashboard");
    cy.get("[data-testId=addStudentNavLink]").click();
  });

  it("Should load Add Students page", () => {
    cy.contains("Add Student");
    cy.url().should("include", "/add-student");
    cy.get("[data-testId=allStudentsLink]").click();
    cy.url().should("include", "/all-students");
    cy.go("back");
    cy.url().should("include", "/add-student");
  });

  it("should show validation errors if required fields are empty", () => {
    cy.get("[data-testId=addStudentForm]").submit();
    cy.url().should("include", "/add-student");
    cy.get("[data-testId=errorContainer]").should("be.visible");
  });

  it("should fill out and submit the form successfully", () => {
    const user = Cypress.env("USER");

    // Fill Personal Info
    cy.log("Filling out personal info");
    cy.get('[name="firstName"]').type(user.firstName);
    cy.get('[name="middleName"]').type(user.middleName);
    cy.get('[name="lastName"]').type(user.lastName);
    cy.get('[name="academicYear"]').select(user.academicYear);
    cy.get('[name="country"]').select(user.country);
    cy.get('[name="religion"]').select(user.religion);
    cy.get('[name="dateOfBirth"]').type(user.dateOfBirth);
    cy.get('[name="gender"]').select(user.gender);
    cy.get('[name="class"]').select(user.class);
    cy.get('[name="address"]').type(user.address);

    // Fill Guardian Info
    cy.get('[name="guardianFirstName"]').type(user.guardian.firstName);
    cy.get('[name="guardianMiddleName"]').type(user.guardian.middleName);
    cy.get('[name="guardianLastName"]').type(user.guardian.lastName);
    cy.get('[name="guardianEmail"]').type(user.guardian.email);
    cy.get('[name="guardianPhoneNumber"]').type(user.guardian.phoneNumber);
    cy.get('[name="relationshipToStudent"]').select(user.guardian.relationship);
    cy.get('[name="guardianOccupation"]').select(user.guardian.occupation);
    cy.get("[name=guardianAddress]").type(user.guardian.address);

    // Verify auto state selection works
    cy.log("Verifying auto state selection works");
    cy.get("[name=stateOfOrigin]").should(
      "have.value",
      "Australian Capital Territory"
    );

    // Upload Profile Photo (optional)
    cy.get('[name="profilePhoto"]').attachFile("images/studentProfile.jpg");

    // Submit the form
    cy.get('button[type="submit"]').click();

    cy.get("[data-testId=successContainer]").should("be.visible");
  });
});
