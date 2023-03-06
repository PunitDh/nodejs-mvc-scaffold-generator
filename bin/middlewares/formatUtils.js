function formatUtils(_, res, next) {
  res.locals.formatDate = (date) => new Date(date).toJSON();
  next();
}

export default formatUtils;
