export const handleError = (error, res) => {
  console.log(error);
  res.sendStatus(500);
};
