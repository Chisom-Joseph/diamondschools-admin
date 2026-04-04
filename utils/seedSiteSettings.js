const { SiteSettings } = require("../models");

const seedSiteSettings = async () => {
  try {
    // Check if site settings already exist
    const existingSettings = await SiteSettings.findOne({
      where: { uniqueKey: 1 },
    });

    if (existingSettings) {
      console.log("✅ Site settings already exist, skipping seed...");
      return;
    }

    // Create default site settings
    const defaultSettings = {
      name: "Diamond Schools",
      title: "Diamond Schools",
      description: "Diamond Schools",
      keywords: "Diamond Schools",
      email: "diamondschoolsnkpor@gmail.com",
      address: "No.7 Ernest Odili Crescent, Nkpor, Anambra State, Nigeria",
      phone1: "07057430682",
      phone2: "08026125461",
      phone3: "08130331977",
      favicon: "/assets/img/logo/favicon.png",
      logo: "/assets/img/logo/logo.png",
      logoLight: "/assets/img/logo/logo-light.png",
      uniqueKey: 1,
    };

    await SiteSettings.create(defaultSettings);
    console.log("✅ Default site settings seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding site settings:", error);
  }
};

module.exports = seedSiteSettings;
