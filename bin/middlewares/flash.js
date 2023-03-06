function flash(_, res, next) {
  res.locals.flash = { success: null, error: null };
  next();
}

export default flash;
