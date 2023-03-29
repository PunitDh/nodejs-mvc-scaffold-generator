Array.prototype.add = function (element) {
  this.push(element);
  return this;
};

Array.prototype.all = function (predicate, thisArg = undefined) {
  return this.every(predicate, thisArg);
};

Array.prototype.any = function (predicate, thisArg = undefined) {
  return this.some(predicate, thisArg);
};

Array.prototype.associate = function (transform) {
  const obj = {};
  for (const item of this) {
    obj[item] = transform(item);
  }
  return obj;
};

Array.prototype.ceil = function () {
  return this.map((item) => Math.ceil(item));
};

Array.prototype.chunked = function (size) {
  const chunkedArray = [];
  for (let i = 0; i < this.length; i += Math.abs(size)) {
    chunkedArray.push(this.slice(i, i + Math.abs(size)));
  }
  return chunkedArray;
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

Array.prototype.distinct = function () {
  return Array.from(new Set(this));
};

Array.prototype.divide = function (number) {
  return this.map((n) => n / number);
};

Array.prototype.exclude = function () {
  const exclusions = [...arguments];
  return this.filter((item) => !exclusions.includes(item));
};

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

Array.prototype.filterNotNull = function () {
  return this.filter((value) => value !== null);
};

Array.prototype.filterNotUndefined = function () {
  return this.filter((value) => value !== undefined);
};

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

Array.prototype.floor = function () {
  return this.map((item) => Math.floor(item));
};

Array.prototype.forEachAsync = async function (callback) {
  for (let it = 0; it < this.length; it++) {
    await callback(this[it], it);
  }
};

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

Array.prototype.groupBy = function (keySelector) {
  const grouped = {};
  const distinctProperties = Array.from(new Set(this.map(keySelector)));
  distinctProperties.forEach((property) => {
    grouped[property] = this.filter((item) => keySelector(item) === property);
  });
  return grouped;
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

Array.prototype.isEmpty = function () {
  return this.length === 0;
};

Array.prototype.isNotEmpty = function () {
  return this.length > 0;
};

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

Array.prototype.mapAsync = async function (callback) {
  let result = [];
  for (let it = 0; it < this.length; it++) {
    const promise = await callback(this[it], it);
    result.push(promise);
  }
  return result;
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

Array.prototype.max = function () {
  return Math.max(...this);
};

Array.prototype.mean = function () {
  return (
    this.reduce((acc, cur) => parseFloat(acc) + parseFloat(cur), 0) /
    this.length
  );
};

Array.prototype.median = function () {
  const sorted = this.sort((a, b) => a - b);
  const idx = Math.floor(sorted.length / 2);
  return sorted[idx];
};

Array.prototype.min = function () {
  return Math.min(...this);
};

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

Array.prototype.multiply = function (number) {
  return this.map((n) => n * number);
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

Array.prototype.power = function (number) {
  return this.map((n) => n ** number);
};

Array.prototype.product = function () {
  return this.reduce((acc, cur) => acc * cur, 1);
};

Array.prototype.random = function () {
  const index = Math.floor(Math.random() * this.length);
  return this[index];
};

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

Array.prototype.replace = function (element, replaced) {
  return this.map((item) => (item === element ? replaced : item));
};

Array.prototype.round = function () {
  return this.map((item) => Math.round(item));
};

Array.prototype.sample = function (sampleSize) {
  const sample = [];

  while (sample.length < sampleSize) {
    const index = Math.floor(Math.random() * this.length);
    sample.push(this[index]);
  }
  return sample;
};

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

Array.prototype.shuffled = function () {
  return this.map((item) => item).sort(() => Math.random() - 0.5);
};

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

Array.prototype.sortBy = function (selector) {
  const newArray = this.map((n) => n);
  return newArray.sort((a, b) => selector(a) - selector(b));
};

Array.prototype.sortByDescending = function (selector) {
  const newArray = this.map((n) => n);
  return newArray.sort((a, b) => selector(b) - selector(a));
};

Array.prototype.stdev = function () {
  const mean =
    this.reduce((acc, cur) => parseFloat(acc) + parseFloat(cur)) / this.length;
  return Math.sqrt(
    this.map((n) => (n - mean) ** 2).reduce(
      (a, b) => parseFloat(a) + parseFloat(b)
    ) / this.length
  );
};

Array.prototype.sum = function () {
  return this.reduce((acc, cur) => parseFloat(acc) + parseFloat(cur), 0);
};

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

Array.prototype.toBoolean = function () {
  return this.map((item) => Boolean(item));
};

Array.prototype.toFixed = function (number) {
  return this.map((n) => n.toFixed(number));
};

Array.prototype.toLowerCase = function () {
  return [...arguments].map((arg) => arg.toLowerCase());
};

Array.prototype.toUpperCase = function () {
  return [...arguments].map((arg) => arg.toUpperCase());
};

Array.prototype.unique = function () {
  return Array.from(new Set(this));
};

String.prototype.capitalize = function () {
  return this.split(/_| /)
    .map((part) => part[0]?.toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
};

String.prototype.count = function (predicate) {
  let count = 0;
  for (let i = 0; i < this.length; i++) {
    if (predicate(this[i])) {
      count++;
    }
  }
  return count;
};

String.prototype.distinct = function () {
  return Array.from(new Set(this.split("")));
};

String.prototype.equals = function (str, ignoreCase = false) {
  return ignoreCase ? str.toLowerCase() === this.toLowerCase() : str === this;
};

String.prototype.equalsIgnoreCase = function (str) {
  return str.toLowerCase() === this.toLowerCase();
};

String.prototype.filter = function (predicate) {
  let str = "";
  for (let i = 0; i < this.length; i++) {
    if (predicate(this[i])) {
      str += this[i];
    }
  }
  return str;
};

String.prototype.forEach = function (callback) {
  for (let it = 0; it < this.length; it++) {
    callback(this[it], it);
  }
};

String.prototype.isConsonant = function () {
  return !["a", "e", "i", "o", "u"].includes(this.toLowerCase());
};

String.prototype.isEmpty = function () {
  return this.trim().length === 0;
};

String.prototype.isLowerCase = function () {
  return this.toLowerCase() === this;
};

String.prototype.isNotEmpty = function () {
  return this.trim().length > 0;
};

String.prototype.isOneOf = function () {
  return [...arguments].includes(this);
};

String.prototype.isUpperCase = function () {
  return this.toUpperCase() === this;
};

String.prototype.isVowel = function () {
  return ["a", "e", "i", "o", "u"].includes(this.toLowerCase());
};

String.prototype.map = function (callback) {
  let result = "";
  for (let it = 0; it < this.length; it++) {
    result += callback(this[it], it);
  }
  return result;
};

String.prototype.truncate = function (delimiter) {
  return this.split(delimiter)[0];
};

String.prototype.unique = function () {
  return Array.from(new Set(this.split("")));
};

String.prototype.words = function () {
  return this.split(/[ ]{1,}/);
};

Number.prototype.clamp = function (min, max) {
  return this < min ? min : this > max ? max : this;
};

Number.prototype.factorial = function () {
  let factorial = 1;
  for (let i = 1; i <= this; i++) {
    factorial *= i;
  }
  return factorial;
};

Number.prototype.isBetween = function (min, max) {
  return this > min && this < max;
};

Number.prototype.isEven = function () {
  return this % 2 === 0;
};

Number.prototype.isFactorOf = function (number) {
  return number % this === 0;
};

Number.prototype.isMultipleOf = function (number) {
  return this % number === 0;
};

Number.prototype.isNatural = function () {
  return this > 0 && this / Math.round(this) === 1;
};

Number.prototype.isOdd = function () {
  return this % 2 === 1;
};

Number.prototype.isPerfectSquare = function () {
  return this === 0 || Math.sqrt(this) / Math.round(Math.sqrt(this)) === 1;
};

Number.prototype.isPrime = function () {
  for (let i = 2, s = Math.sqrt(this); i <= s; i++) {
    if (this % i === 0) return false;
  }
  return this > 1;
};

Number.prototype.isWhole = function () {
  return this >= 0 && (this === 0 || this / Math.round(this) === 1);
};

Number.prototype.times = function (predicate) {
  for (let i = 0; i < this; i++) {
    predicate(i);
  }
};

Number.prototype.timesMap = function (predicate) {
  const result = [];
  for (let i = 0; i < this; i++) {
    result.push(predicate(i));
  }
  return result;
};

Date.prototype.daysSince = function (date) {
  return (this.getTime() - date.getTime()) / (1000 * 3600 * 24);
};

Date.prototype.daysUntil = function (date) {
  return (date.getTime() - this.getTime()) / (1000 * 3600 * 24);
};

Date.prototype.equals = function (date) {
  return this.getTime() === date.getTime();
};

Date.prototype.isAfter = function (date) {
  return this > date;
};

Date.prototype.isBefore = function (date) {
  return this < date;
};

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

Date.prototype.minusDays = function (days) {
  return new Date(this.setDate(this.getDate() - days));
};

Date.prototype.minusHours = function (hours) {
  return new Date(this.setHours(this.getHours() - hours));
};

Date.prototype.minusMilliseconds = function (milliseconds) {
  return new Date(this.setMilliseconds(this.getMilliseconds() - milliseconds));
};

Date.prototype.minusMinutes = function (minutes) {
  return new Date(this.setMinutes(this.getMinutes() - minutes));
};

Date.prototype.minusMonths = function (months) {
  return new Date(this.setMonth(this.getMonth() - months));
};

Date.prototype.minusSeconds = function (seconds) {
  return new Date(this.setSeconds(this.getSeconds() - seconds));
};

Date.prototype.minusWeeks = function (weeks) {
  return new Date(this.setDate(this.getDate() - 7 * weeks));
};

Date.prototype.minusYears = function (years) {
  return new Date(this.setFullYear(this.getFullYear() - years));
};

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

Date.prototype.plusDays = function (days) {
  return new Date(this.setDate(this.getDate() + days));
};

Date.prototype.plusHours = function (hours) {
  return new Date(this.setHours(this.getHours() + hours));
};

Date.prototype.plusMilliseconds = function (milliseconds) {
  return new Date(this.setMilliseconds(this.getMilliseconds() + milliseconds));
};

Date.prototype.plusMinutes = function (minutes) {
  return new Date(this.setMinutes(this.getMinutes() + minutes));
};

Date.prototype.plusMonths = function (months) {
  return new Date(this.setMonth(this.getMonth() + months));
};

Date.prototype.plusSeconds = function (seconds) {
  return new Date(this.setSeconds(this.getSeconds() + seconds));
};

Date.prototype.plusWeeks = function (weeks) {
  return new Date(this.setDate(this.getDate() + 7 * weeks));
};

Date.prototype.plusYears = function (years) {
  return new Date(this.setFullYear(this.getFullYear() + years));
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

Object.prototype.counts = function () {
  if (!this) return;
  const counts = {};
  Object.entries(this).forEach(([key, value]) => {
    counts[key] = value.length;
  });
  counts._totalCounts = Object.values(counts).reduce(
    (acc, cur) => parseFloat(acc) + parseFloat(cur),
    0
  );
  return counts;
};

Object.prototype.entries = function () {
  return this && Object.entries(this);
};

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
    if (Array.isArray(this[key]) !== Array.isArray(other[key])) {
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

  function isObject(obj) {
    return obj !== null && typeof obj === "object";
  }
};

Object.prototype.exclude = function () {
  if (!this) return {};
  const newObj = this.copy();
  [...arguments].forEach((argument) => {
    delete newObj[argument];
  });
  return newObj;
};

Object.prototype.ifEmpty = function (element) {
  if (!this) return;
  return Object.keys(this).length === 0 ? element : this;
};

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

Object.prototype.isEmpty = function () {
  if (!this) return null;
  return (
    Object.keys(this).filter(Boolean).length === 0 ||
    Object.values(this).filter((value) => ![undefined, null].includes(value))
      .length === 0
  );
};

Object.prototype.keys = function () {
  return this && Object.keys(this);
};

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

Object.prototype.values = function () {
  return this && Object.values(this);
};
