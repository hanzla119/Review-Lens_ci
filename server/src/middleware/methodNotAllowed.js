export const methodNotAllowed = (allowedMethods, hint) => (req, res) => {
  res.set("Allow", allowedMethods.join(", "));
  res.status(405).json({
    message: `Method ${req.method} is not allowed for ${req.originalUrl}.`,
    allowedMethods,
    hint,
  });
};
