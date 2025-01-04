module.exports = (length = 6) => {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";

  // Combine all characters into a single string
  const allCharacters = uppercase + lowercase + numbers;

  let password = "";

  // Ensure the password contains at least one character from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];

  // Fill the rest of the password length with random characters
  for (let i = password.length; i < length; i++) {
    password += allCharacters[Math.floor(Math.random() * allCharacters.length)];
  }

  // Shuffle the password to randomize the order of characters
  password = password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  return password;
};
