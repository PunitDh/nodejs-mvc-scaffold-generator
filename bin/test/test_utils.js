import LOGGER from "../logger.js";

export function assertEquals(testCondition, expected, actual) {
  LOGGER.testInfo(testCondition);
  if (
    expected.replaceAll(" ", "").replaceAll("\n", "") ==
    actual.replaceAll(" ", "").replaceAll("\n", "")
  ) {
    LOGGER.test("Test passed");
  } else {
    LOGGER.testFailed("Test failed");
    LOGGER.testFailed("Expected:", expected);
    LOGGER.testFailed("Actual:", actual);
  }
}

export function assertNull(actual) {
  return actual === null
    ? LOGGER.test("Test passed")
    : LOGGER.testFailed("Test failed", actual);
}
