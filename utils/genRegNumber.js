module.exports = (prefix = "REG", year = new Date().getFullYear()) => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  let randomLetters = "";
  for (let i = 0; i < 3; i++) {
    randomLetters += letters[Math.floor(Math.random() * letters.length)];
  }

  let randomNumbers = "";
  for (let i = 0; i < 3; i++) {
    randomNumbers += numbers[Math.floor(Math.random() * numbers.length)];
  }

  return `${prefix}-${year}-${randomLetters}${randomNumbers}`;
};
