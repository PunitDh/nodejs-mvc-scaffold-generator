/**
 * Returns a random integer between the specified values, incremented by a step
 * @param {Integer} min - The smallest random number to generate
 * @param {Integer} max - The largest random number to generate
 * @param {Integer} step - Increment
 * @returns A random number between the two specified min and max values, rounded to the nearest step
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
 * @returns A random item from the list
 */
export function randomChoice(choices) {
  const index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

export function convertToMilliseconds(seconds, nanoseconds) {
  const milliseconds = seconds * 1000 + nanoseconds / 1000000;
  return Math.round(milliseconds * 100) / 100;
}
