import LOGGER from "../logger.js";

export function assertEquals(expected, actual) {
  if (expected === actual) {
    LOGGER.test("Test passed");
  } else {
    LOGGER.test(expected);
    LOGGER.test(actual);
  }
}

export function assertNull(actual) {
  return actual === null
    ? LOGGER.test("Test passed")
    : LOGGER.test("Test failed");
}
