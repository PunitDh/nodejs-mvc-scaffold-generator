const expected = {
  table: "animals",
  columns: [
    {
      name: "legs",
      type: "integer",
      foreignKey: undefined,
    },
    {
      name: "eyes",
      type: "integer",
      foreignKey: undefined,
    },
    {
      name: "zoo_id",
      type: "integer",
      foreignKey: {
        referenceTable: "zoos",
        referenceColumn: "id",
      },
    },
  ],
};

const actual = {
  table: "animals",
  columns: [
    {
      name: "legs",
      type: "integer",
      foreignKey: undefined,
    },
    {
      name: "eyes",
      type: "integer",
      foreignKey: undefined,
    },
    {
      name: "zoo_id",
      type: "integer",
      foreignKey: {
        referenceTable: "zoos",
        referenceColumn: "id",
      },
    },
  ],
};

const test1 = {
  test: "1",
  col: 3,
  cols: [1, 2, 3],
  d: { e: [1, 2, { f: { f: "g" } }] },
};

const test2 = {
  test: "1",
  col: 3,
  cols: [1, 2, 3],
  d: { e: [1, 2, { f: { f: "g" } }] },
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

const arr1 = [1, 2, 3];
const arr2 = [1, 2, 3];

console.log(arr1.equals(arr2));
