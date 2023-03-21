import { randomChoice } from "./num_utils.js";

/* ************************************************************************** /
/ *************************************************************************** /
/ **************************** Array Extensions ***************************** /
/ *************************************************************************** /
/ ************************************************************************** */

/**
 * Returns the first element in the array
 * @returns the first element in the array
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
 * Returns the second element in the array
 * @returns The second element in the array
 */
Array.prototype.second = function () {
  return this[1];
};

/**
 * Returns the second element in the array
 * @returns The second element in the array
 */
Array.prototype.third = function () {
  return this[2];
};

/**
 * Returns the second element in the array
 * @returns The second element in the array
 */
Array.prototype.fourth = function () {
  return this[3];
};

/**
 * Returns the second element in the array
 * @returns The second element in the array
 */
Array.prototype.fifth = function () {
  return this[4];
};

/**
 * Returns the second element in the array
 * @returns The second element in the array
 */
Array.prototype.sixth = function () {
  return this[5];
};

/**
 * Returns the last element in the array
 * @returns the last element in the array
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
 * Performs an async await operation on an array and returns the resultant array.
 * Note: The result must be awaited, i.e. The 'await' keyword must be used before it
 * @param {Function} callback
 * @param {Integer} index
 * @returns A list of promises
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
 * @returns The array with the specified items excluded
 */
Array.prototype.exclude = function () {
  const exclusions = [...arguments];
  return this.filter((item) => !exclusions.includes(item));
};

/**
 * Returns the distinct elements in an array
 * @returns The array with duplicated elements omitted
 */
Array.prototype.distinct = function () {
  return Array.from(new Set(this));
};

/**
 * Converts all elements in the array to upper case
 * @returns Array<String>
 */
Array.prototype.toUpperCase = function () {
  return [...arguments].map((arg) => arg.toUpperCase());
};

/**
 * Converts all elements in the array to lower case
 * @returns Array<String>
 */
Array.prototype.toLowerCase = function () {
  return [...arguments].map((arg) => arg.toLowerCase());
};

/**
 * Returns the sum of all elements in an array
 * @returns Number
 */
Array.prototype.sum = function () {
  return this.reduce((acc, cur) => parseFloat(acc) + parseFloat(cur), 0);
};

/**
 * Checks whether an array is empty
 * @returns Boolean
 */
Array.prototype.isEmpty = function () {
  return this.length === 0;
};

/**
 * Checks whether an array is empty
 * @returns Boolean
 */
Array.prototype.isNotEmpty = function () {
  return this.length > 0;
};

/**
 * Chunks an array into specified size
 * @param {integer} size
 * @returns Array<Array<any>>
 */
Array.prototype.chunked = function (size) {
  const chunkedArray = [];
  for (let i = 0; i < this.length; i += Math.abs(size)) {
    chunkedArray.push(this.slice(i, i + Math.abs(size)));
  }
  return chunkedArray;
};

Array.prototype.includesAll = function () {
  const values = [...arguments].flat();
  for (const value of values) {
    if (!this.includes(value)) {
      return false;
    }
  }
  return true;
};

Array.prototype.intersection = function (array) {
  return array.filter((item) => this.includes(item));
};

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

Array.prototype.count = function (predicate) {
  let count = 0;
  this.forEach((item, index) => {
    if (predicate(item, index)) {
      count++;
    }
  });
  return count;
};

Array.prototype.max = function () {
  return Math.max(...this);
};

Array.prototype.min = function () {
  return Math.min(...this);
};

Array.prototype.round = function () {
  return this.map((item) => Math.round(item));
};

Array.prototype.ceil = function () {
  return this.map((item) => Math.ceil(item));
};

Array.prototype.floor = function () {
  return this.map((item) => Math.floor(item));
};

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

Array.prototype.random = function () {
  return randomChoice(this);
};

Array.prototype.shuffled = function () {
  return this.sort(() => Math.random() - 0.5);
};

Array.prototype.toBoolean = function () {
  return this.map((item) => Boolean(item));
};

Array.prototype.filterNotNull = function () {
  return this.filter((value) => value !== null);
};

Array.prototype.filterNotUndefined = function () {
  return this.filter((value) => value !== undefined);
};

Array.prototype.all = function (predicate, thisArg = undefined) {
  return this.every(predicate, thisArg);
};

Array.prototype.any = function (predicate, thisArg = undefined) {
  return this.some(predicate, thisArg);
};

Array.prototype.groupBy = function (keySelector) {
  const grouped = {};
  const distinctProperties = Array.from(new Set(this.map(keySelector)));
  distinctProperties.forEach((property) => {
    grouped[property] = this.filter((item) => keySelector(item) === property);
  });
  return grouped;
};

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
 * Adds the element to the array and returns the array
 * @param {any} element
 * @returns Array
 */
Array.prototype.add = function (element) {
  this.push(element);
  return this;
};

/* ************************************************************************** /
/ *************************************************************************** /
/ **************************** Object Extensions **************************** /
/ *************************************************************************** /
/ ************************************************************************** */

/**
 * Takes in a variable number of arguments and excludes them from the object
 * @returns The object with the specified key-value pairs excluded from the object
 */
Object.prototype.exclude = function () {
  [...arguments].forEach((argument) => {
    if (this) delete this[argument];
  });
  return this;
};

/**
 * Returns whether the object is empty, i.e. only contains undefined or null values
 * @returns Boolean
 */
Object.prototype.isEmpty = function () {
  if (!this) return;
  return (
    Object.keys(this).filter(Boolean).length === 0 ||
    Object.values(this).filter((value) => ![undefined, null].includes(value))
      .length === 0
  );
};

/**
 * Does a deep comparison of two objects and checks if they are equal
 * @returns Boolean
 */
Object.prototype.equals = function (other) {
  if (this === other) {
    return true;
  }

  const thisKeys = Object.keys(this);
  const otherKeys = Object.keys(other);

  if (otherKeys.length !== thisKeys.length) {
    return false;
  }

  for (const key of thisKeys) {
    if (!other.hasOwnProperty(key)) {
      return false;
    }
    if (typeof this[key] !== typeof other[key]) {
      return false;
    }
    if (isArray(this[key]) !== isArray(other[key])) {
      return false;
    }
    if (isObject(this[key]) === isObject(other[key])) {
      if (!this[key].equals(other[key])) {
        return false;
      }
    } else {
      if (this[key] !== other[key]) {
        return false;
      }
    }
  }
  return true;

  function isArray(arr) {
    return arr instanceof Array;
  }

  function isObject(obj) {
    return obj !== null && typeof obj === "object";
  }
};

/**
 * Returns the key value pairs inside the object as an array of arrays
 * @returns Array<Array<any>>
 */
Object.prototype.entries = function () {
  return this && Object.entries(this);
};

/**
 * Returns the keys of the object
 * @returns Array<String>
 */
Object.prototype.keys = function () {
  return this && Object.keys(this);
};

/**
 * Returns the values of the object
 * @returns Array<String>
 */
Object.prototype.values = function () {
  return this && Object.values(this);
};

/**
 * Removes all entries from an object that have null or undefined values
 * @returns Object
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
 * Checks whether an object exists inside an array of objects (can perform both a deep comparison and a reference comparison)
 * @param {Array<Object>} array - The array to check in
 * @param {Boolean} deep - A boolean flag to determine whether to do a deep comparison or reference comparison (default is FALSE)
 * @returns Boolean
 */
Object.prototype.in = function (array, deep = false) {
  if (!this) return;
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

/* ************************************************************************** /
/ *************************************************************************** /
/ **************************** String Extensions **************************** /
/ *************************************************************************** /
/ ************************************************************************** */

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

/**
 * Checks if a string is an uppercase string
 * @returns Boolean
 */
String.prototype.isUpperCase = function () {
  return this.toUpperCase() === this;
};

/**
 * Checks if a string is a lowercase string
 * @returns Boolean
 */
String.prototype.isLowerCase = function () {
  return this.toLowerCase() === this;
};

/**
 * Checks whether a character is a vowel
 * @returns Boolean
 */
String.prototype.isVowel = function () {
  return ["a", "e", "i", "o", "u"].includes(this.toLowerCase());
};

/**
 * Checks whether a character is a consonant
 * @returns Boolean
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
 */
String.prototype.map = function (callback) {
  const result = "";
  for (let it = 0; it < this.length; it++) {
    result += callback(this[it], it);
  }
  return result;
};

/**
 * Returns the number of characters matching a given predicate function
 * @param {Function} predicate
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
 * @returns Boolean
 */
String.prototype.equalsIgnoreCase = function (str) {
  return str.toLowerCase() === this.toLowerCase();
};

/**
 * Checks if two string are equal, with option to
 * specify whether or not to ignore case
 * @returns Boolean
 */
String.prototype.equals = function (str, ignoreCase = false) {
  return ignoreCase ? str.toLowerCase() === this.toLowerCase() : str === this;
};

/**
 * Checks if the string is empty, ignoring trailing whitespaces on either end
 * @returns Boolean
 */
String.prototype.isEmpty = function () {
  return this.trim().length === 0;
};

/**
 * Checks if the string is not empty, ignoring trailing whitespaces on either end
 * @returns Boolean
 */
String.prototype.isNotEmpty = function () {
  return this.trim().length > 0;
};

/**
 * Returns a set of unique characters in a given string
 * @returns Array<String>
 */
String.prototype.distinct = function () {
  return Array.from(new Set(this.split("")));
};

/**
 * Checks whether a string exists in any one of the arguments
 * @param {String} arguments
 * @returns Boolean
 */
String.prototype.isOneOf = function () {
  return [...arguments].includes(this);
};

/* ************************************************************************** /
/ *************************************************************************** /
/ ***************************** Date Extensions ***************************** /
/ *************************************************************************** /
/ ************************************************************************** */

/**
 * Returns whether the specified date is after the original date
 * @param {Date} date
 * @returns Boolean
 */
Date.prototype.isAfter = function (date) {
  return this > date;
};

/**
 * Returns whether the specified date is before the original date
 * @param {Date} date
 * @returns Boolean
 */
Date.prototype.isBefore = function (date) {
  return this < date;
};

/**
 * Checks whether the specified date is equal to the original date
 * @param {Date} date
 * @returns Boolean
 */
Date.prototype.equals = function (date) {
  return this.getTime() === date.getTime();
};

/**
 * Adds a number of days to the original date
 * @param {Integer} days
 * @returns Date
 */
Date.prototype.plusDays = function (days) {
  return new Date(this.setDate(this.getDate() + days));
};

/**
 * Subtracts a number of days from the original date
 * @param {Integer} days
 * @returns Date
 */
Date.prototype.minusDays = function (days) {
  return new Date(this.setDate(this.getDate() - days));
};

/**
 * Adds a number of weeks to the original date
 * @param {Integer} days
 * @returns Date
 */
Date.prototype.plusWeeks = function (weeks) {
  return new Date(this.setDate(this.getDate() + 7 * weeks));
};

/**
 * Subtracts a number of weeks from the original date
 * @param {Integer} days
 * @returns Date
 */
Date.prototype.minusWeeks = function (weeks) {
  return new Date(this.setDate(this.getDate() - 7 * weeks));
};

/**
 * Adds a number of months to the original date
 * @param {Integer} days
 * @returns Date
 */
Date.prototype.plusMonths = function (months) {
  return new Date(this.setMonth(this.getMonth() + months));
};

/**
 * Subtracts a number of months from the original date
 * @param {Integer} days
 * @returns Date
 */
Date.prototype.minusMonths = function (months) {
  return new Date(this.setMonth(this.getMonth() - months));
};

/**
 * Adds a number of years to the original date
 * @param {Integer} days
 * @returns Date
 */
Date.prototype.plusYears = function (years) {
  return new Date(this.setFullYear(parseInt(this.getFullYear()) + years));
};

/**
 * Subtracts a number of years from the original date
 * @param {Integer} days
 * @returns Date
 */
Date.prototype.minusYears = function (years) {
  return new Date(this.setFullYear(this.getFullYear() - years));
};

/**
 * Adds a number of hours to the original date
 * @param {Integer} days
 * @returns Date
 */
Date.prototype.plusHours = function (hours) {
  return new Date(this.setHours(parseInt(this.getHours()) + hours));
};

/**
 * Subtracts a number of hours from the original date
 * @param {Integer} days
 * @returns Date
 */
Date.prototype.minusHours = function (hours) {
  return new Date(this.setHours(this.getHours() - hours));
};

/**
 * Adds a number of minutes to the original date
 * @param {Integer} days
 * @returns Date
 */
Date.prototype.plusMinutes = function (minutes) {
  return new Date(this.setMinutes(parseInt(this.getMinutes()) + minutes));
};

/**
 * Subtracts a number of minutes from the original date
 * @param {Integer} days
 * @returns Date
 */
Date.prototype.minusMinutes = function (minutes) {
  return new Date(this.setMinutes(this.getMinutes() - minutes));
};

/**
 * Adds a number of seconds to the original date
 * @param {Integer} days
 * @returns Date
 */
Date.prototype.plusSeconds = function (seconds) {
  return new Date(this.setSeconds(parseInt(this.getSeconds()) + seconds));
};

/**
 * Subtracts a number of seconds from the original date
 * @param {Integer} days
 * @returns Date
 */
Date.prototype.minusSeconds = function (seconds) {
  return new Date(this.setSeconds(this.getSeconds() - seconds));
};

/**
 * Adds a number of milliseconds to the original date
 * @param {Integer} days
 * @returns Date
 */
Date.prototype.plusMilliseconds = function (milliseconds) {
  return new Date(
    this.setMilliseconds(parseInt(this.getMilliseconds()) + milliseconds)
  );
};

/**
 * Subtracts a number of milliseconds from the original date
 * @param {Integer} days
 * @returns Date
 */
Date.prototype.minusMilliseconds = function (milliseconds) {
  return new Date(this.setMilliseconds(this.getMilliseconds() - milliseconds));
};

/**
 * Takes in an object containing the number of years/months/days/hours/minutes/seconds/milliseconds to add
 * @param {Object} dateObject
 * @returns Date
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
 * @returns Date
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
 * @returns Integer
 */
Date.prototype.daysUntil = function (date) {
  return (date.getTime() - this.getTime()) / (1000 * 3600 * 24);
};

/**
 * Returns the number of days since a specified date
 * @param {Date} date
 * @returns Integer
 */
Date.prototype.daysSince = function (date) {
  return (this.getTime() - date.getTime()) / (1000 * 3600 * 24);
};

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
