const { FeatureAccess, Sequelize } = require("../models");
const { Op } = Sequelize;

module.exports = async (
  featureFlagId,
  featureName,
  userType = null,
  userUuid = null,
  enabled
) => {
  try {
    // Ensure userType is always an array
    const userTypes =
      typeof userType === "string" ? [userType] : userType || [];

    // Handle individual user access
    if (userUuid) {
      const condition = { FeatureFlagId: featureFlagId, userId: userUuid };
      const existingEntry = await FeatureAccess.findOne({ where: condition });

      if (existingEntry) {
        if (enabled === null) {
          await existingEntry.destroy();
          console.log(`🗑️ Removed '${featureName}' for user ${userUuid}`);
        } else {
          await existingEntry.update({ enabled });
          console.log(
            `🔄 Updated '${featureName}' for user ${userUuid}: ${enabled}`
          );
        }
      } else if (enabled !== null) {
        await FeatureAccess.create({
          FeatureFlagId: featureFlagId,
          userId: userUuid,
          enabled,
        });
        console.log(
          `✅ Added '${featureName}' for user ${userUuid}: ${enabled}`
        );
      }
    }

    // Handle user group access
    const existingGroups = await FeatureAccess.findAll({
      where: { FeatureFlagId: featureFlagId, userType: { [Op.ne]: null } },
    });

    const existingGroupTypes = existingGroups.map((entry) => entry.userType);
    const groupsToRemove = existingGroupTypes.filter(
      (group) => !userTypes.includes(group)
    );

    // Remove groups that are no longer included
    if (groupsToRemove.length > 0) {
      await FeatureAccess.destroy({
        where: { FeatureFlagId: featureFlagId, userType: groupsToRemove },
      });
      console.log(
        `🗑️ Removed '${featureName}' for groups: ${groupsToRemove.join(", ")}`
      );
    }

    // Add or update groups
    for (const group of userTypes) {
      const condition = { FeatureFlagId: featureFlagId, userType: group };
      const existingEntry = await FeatureAccess.findOne({ where: condition });

      if (existingEntry) {
        if (enabled === null) {
          await existingEntry.destroy();
          console.log(`🗑️ Removed '${featureName}' for group ${group}`);
        } else {
          await existingEntry.update({ enabled });
          console.log(
            `🔄 Updated '${featureName}' for group ${group}: ${enabled}`
          );
        }
      } else if (enabled !== null) {
        await FeatureAccess.create({
          FeatureFlagId: featureFlagId,
          userType: group,
          enabled,
        });
        console.log(`✅ Added '${featureName}' for group ${group}: ${enabled}`);
      }
    }

    return true;
  } catch (error) {
    console.error("❌ Error updating feature access:", error);
    return false;
  }
};
