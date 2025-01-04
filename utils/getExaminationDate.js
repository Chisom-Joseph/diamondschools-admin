module.exports = async () => {
  try {
    return "Saturday 2nd December 2024";
  } catch (error) {
    console.error(`ERROR GETTING EXAMINATION DATE`);
    console.error(error.stack);
  }
};
