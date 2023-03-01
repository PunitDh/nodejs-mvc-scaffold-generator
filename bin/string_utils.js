String.prototype.capitalize = function () {
  return this.split("_")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
};
