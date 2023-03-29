/* ************************************************************************** /
/ *************************************************************************** /
/ **************************** Array Extensions ***************************** /
/ *************************************************************************** /
/ ************************************************************************** */

/**
 * Returns the first element in the array or the first element that matches the predicate
 * @param {Function | null} predicate
 * @returns {*}
 */
Array.prototype.first = function (predicate) {
  if (predicate) {
    for (const item of this) {
      if (predicate(item)) {
        return item;
      }
    }
    return null;
  } else {
    return this[0];
  }
};

/**
 * Returns the second element in the array or the second element that matches the predicate
 * @param {Function} predicate
 * @returns {*}
 */
Array.prototype.second = function (predicate) {
  if (predicate) {
    let count = 0;
    for (const item of this) {
      if (predicate(item)) {
        if (count === 1) {
          return item;
        } else {
          count++;
        }
      }
    }
    return null;
  } else {
    return this[1];
  }
};

/**
 * Returns the third element in the array or the third element that matches the predicate
 * @param {Function} predicate
 * @returns {*}
 */
Array.prototype.third = function (predicate) {
  if (predicate) {
    let count = 0;
    for (const item of this) {
      if (predicate(item)) {
        if (count === 2) {
          return item;
        } else {
          count++;
        }
      }
    }
    return null;
  } else {
    return this[2];
  }
};

/**
 * Returns the fourth element in the array or the fourth element that matches the predicate
 * @param {Function} predicate
 * @returns {*}
 */
Array.prototype.fourth = function (predicate) {
  if (predicate) {
    let count = 0;
    for (const item of this) {
      if (predicate(item)) {
        if (count === 3) {
          return item;
        } else {
          count++;
        }
      }
    }
    return null;
  } else {
    return this[3];
  }
};

/**
 * Returns the fifth element in the array or the fifth element that matches the predicate
 * @param {Function} predicate
 * @returns {*}
 */
Array.prototype.fifth = function (predicate) {
  if (predicate) {
    let count = 0;
    for (const item of this) {
      if (predicate(item)) {
        if (count === 4) {
          return item;
        } else {
          count++;
        }
      }
    }
    return null;
  } else {
    return this[4];
  }
};

/**
 * Returns the sixth element in the array or the sixth element that matches the predicate
 * @param {Function} predicate
 * @returns {*}
 */
Array.prototype.sixth = function (predicate) {
  if (predicate) {
    let count = 0;
    for (const item of this) {
      if (predicate(item)) {
        if (count === 5) {
          return item;
        } else {
          count++;
        }
      }
    }
    return null;
  } else {
    return this[5];
  }
};

/**
 * Returns the last element in the array or the last element that matches the predicate
 * @returns {*}
 */
Array.prototype.last = function (predicate) {
  if (predicate) {
    const values = this.reverse();
    for (const value of values) {
      if (predicate(value)) {
        return value;
      }
    }
    return null;
  } else {
    return this[this.length - 1];
  }
};

/**
 * Returns the nth element in the array or the nth element that matches the predicate
 * @param {Function} predicate
 * @param {Number} nth
 * @returns {*}
 */
Array.prototype.match = function (predicate, nth) {
  if (predicate) {
    let count = 0;
    for (const item of this) {
      if (predicate(item)) {
        if (count === nth - 1) {
          return item;
        } else {
          count++;
        }
      }
    }
    return null;
  } else {
    return this[nth - 1];
  }
};

/**
 * Performs an async await operation on an array and returns the resultant array.
 * Note: The result must be awaited, i.e. The 'await' keyword must be used before it
 * @param {Function} callback
 * @returns {Array}
 */
Array.prototype.mapAsync = async function (callback) {
  let result = [];
  for (let it = 0; it < this.length; it++) {
    const promise = await callback(this[it], it);
    result.push(promise);
  }
  return result;
};

/**
 * Performs an async await operation on an array
 * @param {Function} callback
 */
Array.prototype.forEachAsync = async function (callback) {
  for (let it = 0; it < this.length; it++) {
    await callback(this[it], it);
  }
};

/**
 * Takes in a number of arguments and excludes them from the array
 * @returns {Array}
 */
Array.prototype.exclude = function () {
  const exclusions = [...arguments];
  return this.filter((item) => !exclusions.includes(item));
};

/**
 * Returns the distinct elements in an array
 * @returns {Array}
 */
Array.prototype.distinct = function () {
  return Array.from(new Set(this));
};

/**
 * Returns the distinct elements in an array
 * @returns {Array}
 */
Array.prototype.unique = Array.prototype.distinct;

/**
 * Converts all elements in the array to upper case
 * @returns {Array<String>}
 */
Array.prototype.toUpperCase = function () {
  return [...arguments].map((arg) => arg.toUpperCase());
};

/**
 * Converts all elements in the array to lower case
 * @returns {Array<String>}
 */
Array.prototype.toLowerCase = function () {
  return [...arguments].map((arg) => arg.toLowerCase());
};

/**
 * Returns the sum of all elements in an array
 * @returns {Number}
 */
Array.prototype.sum = function () {
  return this.reduce((acc, cur) => +acc + cur, 0);
};

/**
 * Returns the multiplication product of all elements in an array
 * @returns {Number}
 */
Array.prototype.product = function () {
  return this.reduce((acc, cur) => acc * cur, 1);
};

/**
 * Checks whether an array is empty
 * @returns {Boolean}
 */
Array.prototype.isEmpty = function () {
  return this.length === 0;
};

/**
 * Checks whether an array is empty
 * @returns {Boolean}
 */
Array.prototype.isNotEmpty = function () {
  return this.length > 0;
};

/**
 * Chunks an array into specified size
 * @param {Number} size
 * @returns {Array<Array<any>>}
 */
Array.prototype.chunked = function (size) {
  const chunkedArray = [];
  for (let i = 0; i < this.length; i += Math.abs(size)) {
    chunkedArray.push(this.slice(i, i + Math.abs(size)));
  }
  return chunkedArray;
};

/**
 * Checks whether the array includes all the arguments
 * @returns {Boolean}
 */
Array.prototype.includesAll = function () {
  const values = [...arguments].flat();
  for (const value of values) {
    if (!this.includes(value)) {
      return false;
    }
  }
  return true;
};

/**
 * Finds intersection between two arrays
 * @param {Array} array
 * @returns {Array}
 */
Array.prototype.intersection = function (array) {
  return array.filter((item) => this.includes(item));
};

/**
 * Finds the difference between the two arrays
 * @param {Array} array
 * @returns {Array}
 */
Array.prototype.difference = function (array) {
  const diff = [];
  array.forEach((item) => {
    if (!this.includes(item)) {
      diff.push(item);
    }
  });
  this.forEach((item) => {
    if (!array.includes(item)) {
      diff.push(item);
    }
  });
  return diff;
};

/**
 * Returns the number of elements matching a given predicate function
 * @param {Function} predicate
 *
 * @returns {Number}
 */
Array.prototype.count = function (predicate) {
  let count = 0;
  this.forEach((item, index) => {
    if (predicate(item, index)) {
      count++;
    }
  });
  return count;
};

/**
 * Finds the max number in the arguments provided
 * @this {Array<Number>}
 * @returns {Number}
 */
Array.prototype.max = function () {
  return Math.max(...this);
};

/**
 * Finds the min number in the arguments provided
 * @this {Array<Number>}
 * @returns {Number}
 */
Array.prototype.min = function () {
  return Math.min(...this);
};

/**
 * Rounds all the numbers in the arguments provided
 * @this {Array<Number>}
 * @returns {Array<Number>}
 */
Array.prototype.round = function () {
  return this.map((item) => Math.round(item));
};

/**
 * Rounds all the numbers up in the arguments provided
 * @this {Array<Number>}
 * @returns {Array<Number>}
 */
Array.prototype.ceil = function () {
  return this.map((item) => Math.ceil(item));
};

/**
 * Rounds all the numbers down in the arguments provided
 * @this {Array<Number>}
 * @returns {Array<Number>}
 */
Array.prototype.floor = function () {
  return this.map((item) => Math.floor(item));
};

/**
 * Returns whether none of the items match the given predicate
 * @param {Function} predicate
 * @returns {Boolean}
 */
Array.prototype.none = function (predicate) {
  if (predicate) {
    for (const item of this) {
      if (predicate(item)) {
        return false;
      }
    }
    return true;
  } else {
    return this.length === 0;
  }
};

/**
 * Checks if an object exists inside an array using a deep comparison
 * @param {Object} object
 * @returns {Boolean}
 */
Array.prototype.includesObject = function (object) {
  for (const item of this) {
    if (typeof item === "object") {
      if (object.equals(item)) {
        return true;
      }
    } else {
      if (item === object) {
        return true;
      }
    }
  }
  return false;
};

/**
 * Deletes any given number of elements from an array
 * @param {*} elements
 * @returns {Array}
 */
Array.prototype.delete = function (...elements) {
  return this.filter((item) => !elements.includes(item));
};

/**
 * Returns a randomly chosen element within the array
 * @returns {*}
 */
Array.prototype.random = function () {
  const index = Math.floor(Math.random() * this.length);
  return this[index];
};

/**
 * Returns a randomly chosen sample of elements within the array
 * @param {Number} sampleSize
 * @param {Boolean} repeat
 * @returns {Array}
 */
Array.prototype.sample = function (sampleSize, repeat = true) {
  const sample = [];

  if (repeat) {
    while (sample.length < sampleSize) {
      const index = Math.floor(Math.random() * this.length);
      sample.push(this[index]);
    }
  } else {
    let duplicateArray = [...this];
    if (sampleSize > this.length) {
      const errorMessage = `Sample size of '${sampleSize}' is greater than the array length of '${this.length}'`;
      throw new Error(errorMessage);
    }
    while (sample.length < sampleSize) {
      const index = Math.floor(Math.random() * duplicateArray.length);
      const elem = duplicateArray[index];
      duplicateArray = duplicateArray.filter((n) => n !== elem);
      sample.push(elem);
    }
  }
  return sample;
};

/**
 * Returns a new array with its original elements randomly shuffled
 * @returns {Array}
 */
Array.prototype.shuffled = function () {
  return this.map((item) => item).sort(() => Math.random() - 0.5);
};

/**
 * Casts each item in the array to its boolean value
 * @returns {Array<Boolean>}
 */
Array.prototype.toBoolean = function () {
  return this.map((item) => Boolean(item));
};

/**
 * Filters out all the elements in the array that are not null
 * @returns {Array}
 */
Array.prototype.filterNotNull = function () {
  return this.filter((value) => value !== null);
};

/**
 * Filters out all the elements in the array that are not undefined
 * @returns {Array}
 */
Array.prototype.filterNotUndefined = function () {
  return this.filter((value) => value !== undefined);
};

/**
 * Checks whether all the elements in the array matches a given element
 * @param {Function} predicate
 * @param {*} thisArg
 * @returns {Boolean}
 */
Array.prototype.all = function (predicate, thisArg = undefined) {
  return this.every(predicate, thisArg);
};

/**
 * Checks whether any of the elements in the array matches a given element
 * @param {Function} predicate
 * @param {*} thisArg
 * @returns {Boolean}
 */
Array.prototype.any = function (predicate, thisArg = undefined) {
  return this.some(predicate, thisArg);
};

/**
 * Groups the items in a unique key-value pair based on the key selector
 * @param {Function} keySelector
 * @returns {Object}
 * @example
 */
Array.prototype.groupBy = function (keySelector) {
  const grouped = {};
  const distinctProperties = Array.from(new Set(this.map(keySelector)));
  distinctProperties.forEach((property) => {
    grouped[property] = this.filter((item) => keySelector(item) === property);
  });
  return grouped;
};

/**
 * Performs a map on all elements in the array that are not null or undefined
 * @param {Function} callback
 * @returns {Array}
 */
Array.prototype.mapNotNull = function (callback) {
  let results = [];
  for (let it = 0; it < this.length; it++) {
    if (this[it] !== null && this[it] !== undefined) {
      const promise = callback(this[it], it);
      results.push(promise);
    }
  }
  return results;
};

/**
 * Splits the original collection into pair of lists, where first list
 * contains elements for which predicate yielded true, while second list
 * contains elements for which predicate yielded false.
 * @param {Function} predicate
 * @returns {Array<Array<any>>}
 */
Array.prototype.partition = function (predicate) {
  const listTrue = [];
  const listFalse = [];
  for (const item of this) {
    if (predicate(item)) {
      listTrue.push(item);
    } else {
      listFalse.push(item);
    }
  }
  return [listTrue, listFalse];
};

/**
 * Returns a list of all elements sorted according to natural sort order of the value returned by specified selector function.
 * @param {Function} selector
 * @returns {Array}
 */
Array.prototype.sortBy = function (selector) {
  const newArray = this.map((n) => n);
  return newArray.sort((a, b) => (selector(a) > selector(b) ? 1 : -1));
};

/**
 * Returns a list of all elements sorted by descending order according to natural sort order of the value returned by specified selector function.
 * @param {Function} selector
 * @returns {Array}
 */
Array.prototype.sortByDescending = function (selector) {
  const newArray = this.map((n) => n);
  return newArray.sort((a, b) => (selector(a) > selector(b) ? -1 : 1));
};

/**
 * Adds the element to the array and returns the array
 * @param {any} element
 * @returns {Array}
 */
Array.prototype.add = function (element) {
  this.push(element);
  return this;
};

/**
 * Returns the average of the supplied array
 * @returns {Number}
 */
Array.prototype.mean = function () {
  return this.reduce((acc, cur) => +acc + cur, 0) / this.length;
};

/**
 * Returns the median of the supplied array
 * @returns {Number}
 */
Array.prototype.median = function () {
  const sorted = this.sort((a, b) => a - b);
  const idx = Math.floor(sorted.length / 2);
  return sorted[idx];
};

/**
 * Returns the mode (most frequently occurring element) of the array
 * @returns {*}
 */
Array.prototype.mode = function () {
  const counts = {};
  for (let i = 0; i < this.length; i++) {
    if (counts[this[i]]) {
      counts[this[i]] += 1;
    } else {
      counts[this[i]] = 1;
    }
  }
  const max = Math.max(...Object.values(counts));
  for (const [key, value] of Object.entries(counts)) {
    if (value === max) {
      return key;
    }
  }
};

/**
 * Calculate the standard deviation of the array of numbers
 * @returns {Number}
 * @example [3,4,8,7,6].stdev() ==> 1.8547236990991407
 */
Array.prototype.stdev = function () {
  const mean = this.reduce((acc, cur) => +acc + cur) / this.length;
  return Math.sqrt(
    this.map((n) => (n - mean) ** 2).reduce((a, b) => +a + b) / this.length
  );
};

/**
 * Counts all unique occurences in the array and returns them as an object along with the count
 * @returns {Object}
 * @example ['apple', 'apple', 'orange', 'banana', 'banana', 'banana'].counts() ==> { apple: 2, orange: 1, banana: 3 }
 */
Array.prototype.counts = function () {
  const counts = {};
  for (let i = 0; i < this.length; i++) {
    if (counts[this[i]]) {
      counts[this[i]] += 1;
    } else {
      counts[this[i]] = 1;
    }
  }
  return counts;
};

/**
 * Returns an object containing key-value pairs provided by transform function applied to each elements of the array
 * @param {Function} transform
 * @returns {Object}
 * @example ['apple','banana','orange'].associate(fruit => fruit.toUpperCase()) ==> { apple: 'APPLE', banana: 'BANANA', orange: 'ORANGE' }
 */
Array.prototype.associate = function (transform) {
  const obj = {};
  for (const item of this) {
    obj[item] = transform(item);
  }
  return obj;
};

/**
 * Multiplies each element in the array with a given number
 * @param {Number} number
 * @returns {Array}
 * @example [3,2,1].multiply(2) ==> [6,4,2]
 */
Array.prototype.multiply = function (number) {
  return this.map((n) => n * number);
};

/**
 * Divides each element in the array with a given number
 * @param {Number} number
 * @returns {Array}
 * @example [4,8,10].divide(2) ==> [2,4,5]
 */
Array.prototype.divide = function (number) {
  return this.map((n) => n / number);
};

/**
 * Raises each element in the array to the power of a given number
 * @param {Number} number
 * @returns {Array}
 * @example [1,2,3].power(2) ==> [1,4,9]
 */
Array.prototype.power = function (number) {
  return this.map((n) => n ** number);
};

/**
 * Sets the decimal places of each number in the array
 * @param {Number} number
 * @returns {Array}
 * @example [1,2,3].toFixed(2) ==> ['1.00', '2.00', '3.00']
 */
Array.prototype.toFixed = function (number) {
  return this.map((n) => n.toFixed(number));
};

/**
 * Replaces every occurence of an element in an array with a new value
 * @param {any} element
 * @param {any} replaced
 * @returns {Array}
 * @example  [1,2,3,4].replace(2,7) ==> [1,7,3,4]
 */
Array.prototype.replace = function (element, replaced) {
  return this.map((item) => (item === element ? replaced : item));
};

/**
 * Returns an array of numbers counting from start to end
 * @returns {Array}
 * @example [1, 4].range()  ==> [1,2,3,4]
 */
Array.prototype.range = function () {
  const start = this[0];
  const end = this[1];
  const arr = [];
  for (
    let i = start;
    start < end ? i <= end : i >= end;
    start < end ? i++ : i--
  ) {
    arr.push(i);
  }
  return arr;
};

/**
 * Checks if an item exists in the array that matches the given predicate
 * @param {Function} predicate
 * @returns {Boolean}
 */
Array.prototype.exists = function (predicate) {
  for (const item of this) {
    if (predicate(item)) {
      return true;
    }
  }
  return false;
};

/**
 * Returns the first 'n' elements in an array
 * @param {Number} n
 * @returns {Array}
 */
Array.prototype.head = function (n) {
  return n ? (n > this.length ? this : this.slice(0, n)) : [this[0]];
};

/**
 * Returns the last 'n' elements in an array
 * @param {Number} n
 * @returns {Array}
 */
Array.prototype.tail = function (n) {
  return n
    ? n > this.length
      ? this
      : this.slice(this.length - n, this.length)
    : [this[this.length - 1]];
};

/* ************************************************************************** /
/ *************************************************************************** /
/ **************************** Object Extensions **************************** /
/ *************************************************************************** /
/ ************************************************************************** */

/**
 * Returns a deep copy of the original object, while also assigning new values to its properties
 * @param {Object?} newParams
 * @returns {Object}
 */
Object.prototype.copy = function (newParams) {
  if (!this) return {};
  const newObject = Object.keys(this).reduce((newObj, currentKey) => {
    newObj[currentKey] =
      typeof this[currentKey] === "object"
        ? this[currentKey].copy()
        : this[currentKey];
    return newObj;
  }, {});
  return { ...newObject, ...newParams };
};

/**
 * Takes in a variable number of arguments and excludes them from the object
 * @returns {Object}
 * @example { a: 1, b: 2 , c: 3, d: 4, e: 5 }.exclude('d', 'e') ==> { a: 1, b: 2 , c: 3 }
 */
Object.prototype.exclude = function () {
  if (!this) return {};
  const newObj = this && this.copy();
  [...arguments].forEach((argument) => {
    delete newObj[argument];
  });
  return newObj;
};

/**
 * Returns whether the object is empty, i.e. only contains undefined or null values
 * @returns {Boolean}
 */
Object.prototype.isEmpty = function () {
  if (!this) return null;
  return (
    Object.keys(this).filter(Boolean).length === 0 ||
    Object.values(this).filter((value) => ![undefined, null].includes(value))
      .length === 0
  );
};

/**
 * Does a deep comparison of two objects and checks if they are equal
 * @returns {Boolean}
 */
Object.prototype.equals = function (other) {
  if (this === other) {
    return true;
  }
  if (typeof this !== typeof other) {
    return false;
  }
  if (this.constructor !== other.constructor) {
    return false;
  }
  const thisKeys = Object.keys(this);
  const otherKeys = Object.keys(other);
  if (thisKeys.length !== otherKeys.length) {
    return false;
  }
  for (const key of thisKeys) {
    if (!otherKeys.includes(key)) {
      return false;
    }
    const thisValue = this[key];
    const otherValue = other[key];
    if (typeof thisValue !== typeof otherValue) {
      return false;
    }
    if (Array.isArray(thisValue) !== Array.isArray(otherValue)) {
      return false;
    }
    if (typeof thisValue === "object" && !Array.isArray(thisValue)) {
      if (thisValue !== null && !thisValue.equals(otherValue)) {
        return false;
      }
    }
    if (Array.isArray(thisValue)) {
      if (thisValue.length !== otherValue.length) {
        return false;
      }
      for (const [idx, item] of thisValue.entries()) {
        if (typeof item === "object") {
          if (!item.equals(otherValue[idx])) {
            return false;
          }
        } else {
          if (item !== otherValue[idx]) {
            return false;
          }
        }
      }
    }
    if (typeof thisValue === "symbol" || typeof thisValue === "function") {
      if (thisValue.toString() !== otherValue.toString()) {
        return false;
      }
    } else if (typeof thisValue !== "object") {
      if (thisValue !== otherValue) {
        return false;
      }
    }
  }
  return true;
};

/**
 * Returns the key value pairs inside the object as an array of arrays
 * @returns {Array<Array<String, any>>}
 */
Object.prototype.entries = function () {
  return this && Object.entries(this);
};

/**
 * Returns the keys of the object
 * @returns {Array<String>}
 */
Object.prototype.keys = function () {
  return this && Object.keys(this);
};

/**
 * Returns the values of the object
 * @returns {Array<String>}
 */
Object.prototype.values = function () {
  return this && Object.values(this);
};

/**
 * Removes all entries from an object that have null or undefined values
 * @returns {Object}
 */
Object.prototype.sanitize = function () {
  return (
    this &&
    Object.fromEntries(
      Object.entries(this).filter(
        ([_, value]) => ![undefined, null].includes(value)
      )
    )
  );
};

/**
 * Converts an object to a map
 * @returns {Map}
 */
Object.prototype.toMap = function () {
  return new Map(Object.entries(this));
};

/**
 * Checks whether an object exists inside an array of objects (can perform both a deep comparison and a reference comparison)
 * @param {Array<Object>} array - The array to check in
 * @param {Boolean} deep - A boolean flag to determine whether to do a deep comparison or reference comparison (default is FALSE)
 * @returns {Boolean}
 */
Object.prototype.in = function (array, deep = false) {
  if (!this) return null;
  if (deep) {
    for (const item of array) {
      if (item.equals(this)) {
        return true;
      }
    }
    return false;
  }
  return array.includes(this);
};

Object.prototype.max = function () {
  if (!this) return;
  const max = Math.max(...Object.values(this));
  for (const [key, value] of Object.entries(this)) {
    if (value === max) {
      return { [key]: value };
    }
  }
};

Object.prototype.min = function () {
  if (!this) return;
  const min = Math.min(...Object.values(this));
  for (const [key, value] of Object.entries(this)) {
    if (value === min) {
      return { [key]: value };
    }
  }
};

/**
 * If the object is not empty, returns the object. If it is empty, returns the argument.
 * @param {*} element
 * @returns {Object}
 */
Object.prototype.ifEmpty = function (element) {
  if (!this) return;
  return Object.keys(this).length === 0 ? element : this;
};

/**
 * Given an object of key-array pairs, returns the count of each array
 * @returns {Object}
 */
Object.prototype.counts = function () {
  if (!this) return;
  const counts = {};
  Object.entries(this).forEach(([key, value]) => {
    counts[key] = value.length;
  });
  counts._totalCounts = Object.values(counts).reduce(
    (acc, cur) => +acc + cur,
    0
  );
  return counts;
};

/* ************************************************************************** /
/ *************************************************************************** /
/ **************************** String Extensions **************************** /
/ *************************************************************************** /
/ ************************************************************************** */

/**
 * Capitalizes the first letter of each word in the specified string
 * Words separated by an underscore ("_") are treated as separate words
 * @returns {String}
 */
String.prototype.capitalize = function () {
  return this.split(/_| /)
    .map((part) => part[0]?.toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
};

/**
 * Splits the string into words, separated by one or more spaces
 * @returns {Array<String>}
 */
String.prototype.words = function () {
  return this.split(/[ ]+/);
};

/**
 * Checks if a string is an uppercase string
 * @returns {Boolean}
 */
String.prototype.isUpperCase = function () {
  return this.toUpperCase() === this;
};

/**
 * Checks if a string is a lowercase string
 * @returns {Boolean}
 */
String.prototype.isLowerCase = function () {
  return this.toLowerCase() === this;
};

/**
 * Checks whether a character is a vowel
 * @returns {Boolean}
 */
String.prototype.isVowel = function () {
  return ["a", "e", "i", "o", "u"].includes(this.toLowerCase());
};

/**
 * Checks whether a character is a consonant
 * @returns {Boolean}
 */
String.prototype.isConsonant = function () {
  return !["a", "e", "i", "o", "u"].includes(this.toLowerCase());
};

/**
 * Performs a forEach operation on a string
 * @param {Function} callback
 */
String.prototype.forEach = function (callback) {
  for (let it = 0; it < this.length; it++) {
    callback(this[it], it);
  }
};

/**
 * Performs a map operation on a string
 * @param {Function} callback
 * @returns {String}
 */
String.prototype.map = function (callback) {
  let result = "";
  for (let it = 0; it < this.length; it++) {
    result += callback(this[it], it);
  }
  return result;
};

/**
 * Returns the number of characters matching a given predicate function
 * @param {Function} predicate
 * @returns {Number}
 */
String.prototype.count = function (predicate) {
  let count = 0;
  for (let i = 0; i < this.length; i++) {
    if (predicate(this[i])) {
      count++;
    }
  }
  return count;
};

/**
 * Filters the characters matching a given predicate function
 * @param {Function} predicate
 * @returns {String}
 */
String.prototype.filter = function (predicate) {
  let str = "";
  for (let i = 0; i < this.length; i++) {
    if (predicate(this[i])) {
      str += this[i];
    }
  }
  return str;
};

/**
 * Checks if two string are equal, ignoring case
 * @returns {Boolean}
 */
String.prototype.equalsIgnoreCase = function (str) {
  return str.toLowerCase() === this.toLowerCase();
};

/**
 * Checks if two string are equal, with option to
 * specify whether or not to ignore case
 * @param {String} str
 * @param {Boolean} ignoreCase
 * @returns {Boolean}
 */
String.prototype.equals = function (str, ignoreCase = false) {
  return ignoreCase ? str.toLowerCase() === this.toLowerCase() : str === this;
};

/**
 * Checks if the string is empty, ignoring trailing whitespaces on either end
 * @returns {Boolean}
 */
String.prototype.isEmpty = function () {
  return this.trim().length === 0;
};

/**
 * Checks if the string is not empty, ignoring trailing whitespaces on either end
 * @returns {Boolean}
 */
String.prototype.isNotEmpty = function () {
  return this.trim().length > 0;
};

/**
 * Returns a set of unique characters in a given string
 * @returns {Array<String>}
 */
String.prototype.distinct = function () {
  return Array.from(new Set(this.split("")));
};

/**
 * Returns a set of unique characters in a given string
 * @returns {Array<String>}
 */
String.prototype.unique = String.prototype.distinct;

/**
 * Checks whether a string exists in any one of the arguments
 * @param {String} arguments
 * @returns {Boolean}
 */
String.prototype.isOneOf = function () {
  return [...arguments].includes(this);
};

/**
 * Truncates everything after the delimiter
 * @param {String} delimiter
 * @returns {String}
 */
String.prototype.truncate = function (delimiter) {
  return this.split(delimiter)[0];
};

/* ************************************************************************** /
/ *************************************************************************** /
/ ***************************** Date Extensions ***************************** /
/ *************************************************************************** /
/ ************************************************************************** */

/**
 * Returns whether the specified date is after the original date
 * @param {Date} date
 * @returns {Boolean}
 */
Date.prototype.isAfter = function (date) {
  return this > date;
};

/**
 * Returns whether the specified date is before the original date
 * @param {Date} date
 * @returns {Boolean}
 */
Date.prototype.isBefore = function (date) {
  return this < date;
};

/**
 * Checks whether the specified date is equal to the original date
 * @param {Date} date
 * @returns {Boolean}
 */
Date.prototype.equals = function (date) {
  return this.getTime() === date.getTime();
};

/**
 * Adds a number of days to the original date
 * @param {Number} days
 * @returns {Date}
 */
Date.prototype.plusDays = function (days) {
  return new Date(this.setDate(this.getDate() + days));
};

/**
 * Subtracts a number of days from the original date
 * @param {Number} days
 * @returns {Date}
 */
Date.prototype.minusDays = function (days) {
  return new Date(this.setDate(this.getDate() - days));
};

/**
 * Adds a number of weeks to the original date
 * @param {Number} weeks
 * @returns {Date}
 */
Date.prototype.plusWeeks = function (weeks) {
  return new Date(this.setDate(this.getDate() + 7 * weeks));
};

/**
 * Subtracts a number of weeks from the original date
 * @param {Number} weeks
 * @returns {Date}
 */
Date.prototype.minusWeeks = function (weeks) {
  return new Date(this.setDate(this.getDate() - 7 * weeks));
};

/**
 * Adds a number of months to the original date
 * @param {Number} months
 * @returns {Date}
 */
Date.prototype.plusMonths = function (months) {
  return new Date(this.setMonth(this.getMonth() + months));
};

/**
 * Subtracts a number of months from the original date
 * @param {Number} months
 * @returns {Date}
 */
Date.prototype.minusMonths = function (months) {
  return new Date(this.setMonth(this.getMonth() - months));
};

/**
 * Adds a number of years to the original date
 * @param {Number} years
 * @returns {Date}
 */
Date.prototype.plusYears = function (years) {
  return new Date(this.setFullYear(this.getFullYear() + years));
};

/**
 * Subtracts a number of years from the original date
 * @param {Number} years
 * @returns {Date}
 */
Date.prototype.minusYears = function (years) {
  return new Date(this.setFullYear(this.getFullYear() - years));
};

/**
 * Adds a number of hours to the original date
 * @param {Number} hours
 * @returns {Date}
 */
Date.prototype.plusHours = function (hours) {
  return new Date(this.setHours(this.getHours() + hours));
};

/**
 * Subtracts a number of hours from the original date
 * @param {Number} hours
 * @returns {Date}
 */
Date.prototype.minusHours = function (hours) {
  return new Date(this.setHours(this.getHours() - hours));
};

/**
 * Adds a number of minutes to the original date
 * @param {Number} minutes
 * @returns {Date}
 */
Date.prototype.plusMinutes = function (minutes) {
  return new Date(this.setMinutes(this.getMinutes() + minutes));
};

/**
 * Subtracts a number of minutes from the original date
 * @param {Number} minutes
 * @returns {Date}
 */
Date.prototype.minusMinutes = function (minutes) {
  return new Date(this.setMinutes(this.getMinutes() - minutes));
};

/**
 * Adds a number of seconds to the original date
 * @param {Number} seconds
 * @returns {Date}
 */
Date.prototype.plusSeconds = function (seconds) {
  return new Date(this.setSeconds(this.getSeconds() + seconds));
};

/**
 * Subtracts a number of seconds from the original date
 * @param {Number} seconds
 * @returns {Date}
 */
Date.prototype.minusSeconds = function (seconds) {
  return new Date(this.setSeconds(this.getSeconds() - seconds));
};

/**
 * Adds a number of milliseconds to the original date
 * @param {Number} milliseconds
 * @returns {Date}
 */
Date.prototype.plusMilliseconds = function (milliseconds) {
  return new Date(this.setMilliseconds(this.getMilliseconds() + milliseconds));
};

/**
 * Subtracts a number of milliseconds from the original date
 * @param {Number} milliseconds
 * @returns {Date}
 */
Date.prototype.minusMilliseconds = function (milliseconds) {
  return new Date(this.setMilliseconds(this.getMilliseconds() - milliseconds));
};

/**
 * Takes in an object containing the number of years/months/days/hours/minutes/seconds/milliseconds to add
 * @param {Object} dateObject
 * @returns {Date}
 */
Date.prototype.plus = function ({
  years = 0,
  months = 0,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0,
}) {
  const newDate = this;
  newDate.setFullYear(newDate.getFullYear() + years);
  newDate.setMonth(newDate.getMonth() + months);
  newDate.setDate(newDate.getDate() + days);
  newDate.setHours(newDate.getHours() + hours);
  newDate.setMinutes(newDate.getMinutes() + minutes);
  newDate.setSeconds(newDate.getSeconds() + seconds);
  newDate.setMilliseconds(newDate.getMilliseconds() + milliseconds);
  return newDate;
};

/**
 * Takes in an object containing the number of years/months/days/hours/minutes/seconds/milliseconds to subtract
 * @param {Object} dateObject
 * @returns {Date}
 */
Date.prototype.minus = function ({
  years = 0,
  months = 0,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0,
}) {
  const newDate = this;
  newDate.setFullYear(newDate.getFullYear() - years);
  newDate.setMonth(newDate.getMonth() - months);
  newDate.setDate(newDate.getDate() - days);
  newDate.setHours(newDate.getHours() - hours);
  newDate.setMinutes(newDate.getMinutes() - minutes);
  newDate.setSeconds(newDate.getSeconds() - seconds);
  newDate.setMilliseconds(newDate.getMilliseconds() - milliseconds);
  return newDate;
};

/**
 * Returns the number of days until a specified date
 * @param {Date} date
 * @returns {Number}
 */
Date.prototype.daysUntil = function (date) {
  return (date.getTime() - this.getTime()) / (1000 * 3600 * 24);
};

/**
 * Returns the number of days since a specified date
 * @param {Date} date
 * @returns {Number}
 */
Date.prototype.daysSince = function (date) {
  return (this.getTime() - date.getTime()) / (1000 * 3600 * 24);
};

/**
 * Formats the date according to strftime format
 * @param {String} sFormat
 * @returns {String}
 */
Date.prototype.strfTime = function (sFormat) {
  if (typeof sFormat !== "string") {
    return "";
  }

  const nDay = this.getDay();
  const nDate = this.getDate();
  const nMonth = this.getMonth();
  const nYear = this.getFullYear();
  const nHour = this.getHours();
  const nTime = this.getTime();
  const aDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const aMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const aDayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const isLeapYear = () =>
    (nYear % 4 === 0 && nYear % 100 !== 0) || nYear % 400 === 0;
  const getThursday = () => {
    const target = new Date(this);
    target.setDate(nDate - ((nDay + 6) % 7) + 3);
    return target;
  };
  const zeroPad = (nNum, nPad) => (Math.pow(10, nPad) + nNum + "").slice(1);

  return sFormat.replace(/%[a-z]+\b/gi, (sMatch) => {
    return (
      ({
        "%a": aDays[nDay].slice(0, 3),
        "%A": aDays[nDay],
        "%b": aMonths[nMonth].slice(0, 3),
        "%B": aMonths[nMonth],
        "%c": this.toUTCString().replace(",", ""),
        "%C": Math.floor(nYear / 100),
        "%d": zeroPad(nDate, 2),
        "%e": nDate,
        "%F": new Date(nTime - this.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 10),
        "%G": getThursday().getFullYear(),
        "%g": (getThursday().getFullYear() + "").slice(2),
        "%H": zeroPad(nHour, 2),
        "%I": zeroPad(((nHour + 11) % 12) + 1, 2),
        "%j": zeroPad(
          aDayCount[nMonth] + nDate + (nMonth > 1 && isLeapYear() ? 1 : 0),
          3
        ),
        "%k": nHour,
        "%l": ((nHour + 11) % 12) + 1,
        "%m": zeroPad(nMonth + 1, 2),
        "%n": nMonth + 1,
        "%M": zeroPad(this.getMinutes(), 2),
        "%p": nHour < 12 ? "AM" : "PM",
        "%P": nHour < 12 ? "am" : "pm",
        "%s": Math.round(nTime / 1000),
        "%S": zeroPad(this.getSeconds(), 2),
        "%u": nDay || 7,
        "%V": (() => {
          const target = getThursday();
          const n1stThu = target.valueOf();
          target.setMonth(0, 1);
          const nJan1 = target.getDay();

          if (nJan1 !== 4) {
            target.setMonth(0, 1 + ((4 - nJan1 + 7) % 7));
          }

          return zeroPad(1 + Math.ceil((n1stThu - target) / 604800000), 2);
        })(),
        "%w": nDay,
        "%x": this.toLocaleDateString(),
        "%X": this.toLocaleTimeString(),
        "%y": (nYear + "").slice(2),
        "%Y": nYear,
        "%z": this.toTimeString().replace(/.+GMT([+-]\d+).+/, "$1"),
        "%Z": this.toTimeString().replace(/.+\((.+?)\)$/, "$1"),
        "%Zs": new Intl.DateTimeFormat("default", {
          timeZoneName: "short",
        })
          .formatToParts(this)
          .find((oPart) => oPart.type === "timeZoneName")?.value,
      }[sMatch] || "") + "" || sMatch
    );
  });
};

/* ************************************************************************** /
/ *************************************************************************** /
/ **************************** Number Extensions **************************** /
/ *************************************************************************** /
/ ************************************************************************** */

/**
 * Checks if a number falls between two values, not inclusive of min and max itself
 * @param {Number} min
 * @param {Number} max
 * @returns {Boolean}
 */
Number.prototype.isBetween = function (min, max) {
  return this > min && this < max;
};

/**
 * Clamps the number in between two numbers
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
Number.prototype.clamp = function (min, max) {
  return this < min ? min : this > max ? max : this;
};

/**
 * Performs the predicate function an n number of times
 * @param {Function} predicate
 */
Number.prototype.times = function (predicate) {
  for (let i = 0; i < this; i++) {
    predicate(i);
  }
};

Number.prototype.repeat = Number.prototype.times;

/**
 * Performs the predicate function an n number of times and returns the result
 * @param {Function} predicate
 * @returns {Array}
 */
Number.prototype.timesMap = function (predicate) {
  const result = [];
  for (let i = 0; i < this; i++) {
    result.push(predicate(i));
  }
  return result;
};

/**
 * Checks if a number is prime with O(sqrt(n)) time complexity
 * @returns {Boolean}
 */
Number.prototype.isPrime = function () {
  for (let i = 2, s = Math.sqrt(this); i <= s; i++) {
    if (this % i === 0) return false;
  }
  return this > 1;
};

/**
 * Returns whether the number is a factor of another number
 * @param {Number} number
 * @returns {Boolean}
 */
Number.prototype.isFactorOf = function (number) {
  return number % this === 0;
};

/**
 * Returns whether the number is a multiple of another number
 * @param {Number} number
 * @returns {Boolean}
 */
Number.prototype.isMultipleOf = function (number) {
  return this % number === 0;
};

/**
 * Checks if a number is a perfect square
 * @returns {Boolean}
 */
Number.prototype.isPerfectSquare = function () {
  return this === 0 || Math.sqrt(this) / Math.round(Math.sqrt(this)) === 1;
};

/**
 * Checks if a number is a natural number
 * @returns {Boolean}
 */
Number.prototype.isNatural = function () {
  return this > 0 && this / Math.round(this) === 1;
};

/**
 * Checks if a number is a whole number
 * @returns {Boolean}
 */
Number.prototype.isWhole = function () {
  return this >= 0 && (this === 0 || this / Math.round(this) === 1);
};

/**
 * Checks if a number is even
 * @returns {Boolean}
 */
Number.prototype.isEven = function () {
  return this % 2 === 0;
};

/**
 * Checks if a number is odd
 * @returns {Boolean}
 */
Number.prototype.isOdd = function () {
  return this % 2 === 1;
};

/**
 * Returns the factorial of a number
 * @returns {Number}
 */
Number.prototype.factorial = function () {
  if (this < 0) { return null }
  let factorial = 1;
  for (let i = 1; i <= this; i++) {
    factorial *= i;
  }
  return factorial;
};
