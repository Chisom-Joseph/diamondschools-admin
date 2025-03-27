const { FeatureFlag } = require("../models");

const defaultFeatures = require("../config/featureFlags");

const seedFeatures = async () => {
  try {
    // Fetch all existing features from the database
    const existingFeatures = await FeatureFlag.findAll();
    const existingFeatureNames = existingFeatures.map((f) => f.feature);

    // Add missing features
    for (const feature of defaultFeatures) {
      if (!existingFeatureNames.includes(feature.feature)) {
        await FeatureFlag.create({
          feature: feature.feature,
          title: feature.title,
          userGroup: feature.userGroup,
        });
        console.log(`✅ Feature added: ${feature.feature}`);
      }
    }

    // Remove features that are no longer in defaultFeatures
    for (const feature of existingFeatures) {
      if (!defaultFeatures.some((f) => f.feature === feature.feature)) {
        await FeatureFlag.destroy({ where: { feature: feature.feature } });
        console.log(`🗑️ Feature deleted: ${feature.feature}`);
      }
    }
  } catch (error) {
    console.error("❌ Error seeding features:", error);
  }
};

module.exports = seedFeatures;
