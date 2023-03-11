Array.prototype.mapAsync = async function (callback) {
  let result = [];
  for (const it of this) {
    const promise = await callback(it);
    result.push(promise);
  }
  return result;
};

Array.prototype.forEachAsync = async function (callback) {
  for (const it of this) {
    await callback(it);
  }
};

Object.prototype.exclude = function () {
  [...arguments].forEach((argument) => {
    delete this[argument];
  });
  return this;
};

Array.prototype.exclude = function () {
  const exclusions = [...arguments];
  return this.filter((item) => !exclusions.includes(item));
};

String.prototype.capitalize = function () {
  return this.split("_")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
};
