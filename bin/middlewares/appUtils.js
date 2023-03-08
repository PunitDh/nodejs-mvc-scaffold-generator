import SETTINGS from "../utils/settings.js";
import "../utils/js_utils.js";
import "pluralizer";

export default function () {
  return function (req, res, next) {
    res.locals.formatDate = (date) => new Date(date).toJSON() || date;
    res.locals.formatCurrency = (amount, decimals = 2, currency = "USD") =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
      }).format(amount);
    res.locals.currentUser = null;
    res.locals.flash = {
      success: req.flash("success"),
      error: req.flash("error"),
    };
    res.locals.dateFields = SETTINGS.views.pages.dateFields;
    res.locals.capitalize = (text) => text.capitalize();
    res.locals.pluralize = (text) => text.pluralize();
    next();
  };
}
