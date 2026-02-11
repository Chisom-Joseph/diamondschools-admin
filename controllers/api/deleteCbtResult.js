const { AttemptedSubject } = require("../../models");

module.exports = async (req, res) => {
  try {
    const cbtResultId = req.body.id;

    if (!cbtResultId) {
      return res.status(400).json({
        success: false,
        message: "CBT result ID is required",
      });
    }

    // Check if CBT result exists
    const cbtResult = await AttemptedSubject.findOne({
      where: { id: cbtResultId },
    });

    if (!cbtResult) {
      return res.status(404).json({
        success: false,
        message: "CBT result not found",
      });
    }

    // Delete the CBT result
    await AttemptedSubject.destroy({
      where: { id: cbtResultId },
    });

    res.status(200).json({
      success: true,
      message: "CBT result deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting CBT result:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the CBT result",
    });
  }
};
