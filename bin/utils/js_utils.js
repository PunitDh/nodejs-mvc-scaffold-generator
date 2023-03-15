/**
 * Returns the first element in the array
 * @returns the first element in the array
 */
Array.prototype.first = function () {
  return this[0];
};

/**
 * Returns the second element in the array
 * @returns The second element in the array
 */
Array.prototype.second = function () {
  return this[1];
};

/**
 * Returns the last element in the array
 * @returns the last element in the array
 */
Array.prototype.last = function () {
  return this[this.length - 1];
};

/**
 * Performs an async await operation on an array and returns the resultant array.
 * Note: The result must be awaited, i.e. The 'await' keyword must be used before it
 * @param {Function} callback 
 * @returns A list of promises
 */
Array.prototype.mapAsync = async function (callback) {
  let result = [];
  for (const it of this) {
    const promise = await callback(it);
    result.push(promise);
  }
  return result;
};

/**
 * Performs an async await operation on an array
 * @param {Function} callback 
 */
Array.prototype.forEachAsync = async function (callback) {
  for (const it of this) {
    await callback(it);
  }
};

/**
 * Takes in a variable number of arguments and excludes them from the object
 * @returns The object with the specified key-value pairs excluded from the object
 */
Object.prototype.exclude = function () {
  [...arguments].forEach((argument) => {
    delete this[argument];
  });
  return this;
};

/**
 * Takes in a variable number of arguments and excludes them from the array
 * @returns The array with the specified items excluded
 */
Array.prototype.exclude = function () {
  const exclusions = [...arguments];
  return this.filter((item) => !exclusions.includes(item));
};

/**
 * Capitalizes the first letter of each word in the specified string
 * Words separated by an underscore ("_") are treated as separate words
 * @returns Capitalized word
 */
String.prototype.capitalize = function () {
  return this.split(/_| /)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
};
