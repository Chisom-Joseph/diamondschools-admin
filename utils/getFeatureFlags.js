const { FeatureFlag, FeatureAccess } = require("../models");

module.exports = async () => {
  try {
    const featureFlags = await FeatureFlag.findAll({
      include: [
        {
          model: FeatureAccess,
          attributes: ["userType", "userId", "enabled"], // Only fetch relevant fields
        },
      ],
    });

    // Ensure userGroup is properly parsed
    featureFlags.forEach((flag) => {
      if (typeof flag.userGroup === "string") {
        flag.userGroup = JSON.parse(flag.userGroup);
      }
    });

    return featureFlags;
  } catch (error) {
    console.error("❌ ERROR GETTING FEATURE FLAGS:", error);
    return [];
  }
};
