module.exports = (errorCode, errorDetails, res) => {
  const error = {
    statusCode: errorCode || 500,
    title: errorDetails.title || "Internal Server Error",
    message:
      errorDetails.message || "Something went wrong. Please try again later.",
  };
  return res.status(errorCode).render("error.ejs", { error });
};
