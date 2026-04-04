const { PaymentSettings } = require("../models");

const defaults = {
  description: "2025/2026 ENTRANCE EXAMINATION FORM",
  amount: "NGN1,500",
  accountNumber: "1228721078",
  accountName: "Diamond Schools Nkpor",
  bankName: "Zenith Bank",
  accountType: "Savings",
};

module.exports = async () => {
  try {
    const paymentSettings = await PaymentSettings.findOne({
      where: { uniqueKey: 1 },
    });
    if (!paymentSettings) return defaults;
    return paymentSettings.toJSON();
  } catch (error) {
    console.error("Error fetching payment settings:", error);
    return defaults;
  }
};
