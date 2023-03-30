/**
 * Returns a random integer between the specified values, incremented by a step
 * @param {Number} min - The smallest random number to generate
 * @param {Number} max - The largest random number to generate
 * @param {Number} step - Increment
 * @returns {Number}
 */
export function randomInteger(min, max, step = 1) {
  return (
    Math.floor((Math.random() * (max - min + 1) + min) * (step || 1)) /
    (step || 1)
  );
}

/**
 * Returns a random item from the list of given items
 * @param {Array} choices - The items to choose from
 * @returns {*}
 */
export function randomChoice(choices) {
  const index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

/**
 * Given the seconds and nanoseconds, converts it into milliseconds
 * @param {Number} seconds
 * @param {Number} nanoseconds
 * @returns {Number}
 */
export function convertToMilliseconds(seconds, nanoseconds) {
  const milliseconds = seconds * 1000 + nanoseconds / 1000000;
  return Math.round(milliseconds * 100) / 100;
}

export class ImaginaryNumber extends Number {
  constructor(real, imaginary) {
    super();
    this.real = real;
    this.imaginary = imaginary;
  }

  /**
   * Adds an imaginary number to another imaginary number
   * @param {ImaginaryNumber} number
   */
  plus(number) {
    return new ImaginaryNumber(
      +this.real + +number.real,
      +this.imaginary + +number.imaginary
    );
  }

  /**
   * Subtracts an imaginary number from another imaginary number
   * @param {ImaginaryNumber} number
   */
  minus(number) {
    return new ImaginaryNumber(
      +this.real - number.real,
      +this.imaginary - number.imaginary
    );
  }

  /**
   * Multiplies an imaginary number to another imaginary number
   * @param {ImaginaryNumber} number
   */
  multiply(number) {
    // (2+2i) * (2+2i)
    return new ImaginaryNumber(
      this.real * number.real - this.imaginary * number.imaginary,
      this.real * number.imaginary + this.imaginary * number.real
    );
  }

  /**
   * Divides an imaginary number by another imaginary number
   * @param {ImaginaryNumber} number
   */
  divide(number) {
    const numerator = this.multiply(this.conjugate);
    const denominator = number.multiply(this.conjugate);
    const division = new ImaginaryNumber(
      numerator.real / denominator.real,
      numerator.imaginary / denominator.real
    );
    return division;
  }

  pow(number) {
    let initial = this;
    for (let i = 1; i < number; i++) {
      initial = initial.multiply(this);
    }
    return initial;
  }

  abs() {
    return Math.sqrt(this.real ** 2 + this.imaginary ** 2);
  }

  toString() {
    return `${this.real !== 0 ? this.real : ""} ${
      this.imaginary > 0 ? "+" : this.imaginary < 0 ? "-" : ""
    } ${this.imaginary !== 0 ? Math.abs(this.imaginary) + "i" : ""}`;
  }

  get conjugate() {
    return new ImaginaryNumber(this.real, -this.imaginary);
  }

  toAngleNotation() {
    return new AngleNotation(
      this.abs(),
      radToDeg(Math.atan(this.real / this.imaginary))
    );
  }
}

function radToDeg(rad) {
  return (rad * 360) / (2 * Math.PI);
}

class AngleNotation {
  constructor(magnitude, angle) {
    this.magnitude = magnitude;
    this.angle = angle;
  }
}

export class Vector {
  constructor(...nums) {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    nums.forEach((num, i) => {
      this[chars[i]] = num;
    });
  }

  dot(vector) {
    let product = 0;
    Object.keys(vector).forEach((key) => {
      product += +(this[key] * vector[key]);
    });
    return product;
  }

  cross(vector) {
    const result = new Vector();
    const keys = Object.keys(vector);
    const [a1, a2, a3] = Object.values(this);
    const [b1, b2, b3] = Object.values(vector);

    result[keys[0]] = a2 * b3 - a3 * b2;
    result[keys[1]] = a3 * b1 - a1 * b3;
    result[keys[2]] = a1 * b2 - a2 * b1;

    return result;
  }
}
