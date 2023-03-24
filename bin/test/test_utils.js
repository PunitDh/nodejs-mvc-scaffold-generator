import LOGGER from "../logger.js";
import "../utils/js_utils.js";

export function assertEquals(testCondition, expected, actual) {
  LOGGER.testInfo(testCondition);
  let isEqual;
  switch (typeof expected) {
    case "string":
      isEqual =
        expected.replaceAll(" ", "").replaceAll("\n", "") ===
        actual.replaceAll(" ", "").replaceAll("\n", "");
      break;
    case "object":
      isEqual = expected.equals(actual);
      break;
    default:
      isEqual = expected === actual;
      break;
  }
  if (isEqual) {
    LOGGER.test("Test passed");
  } else {
    LOGGER.testFailed("Test failed");
    LOGGER.testFailed("Expected:", expected);
    LOGGER.testFailed("Actual:", actual);
  }
  return isEqual;
}

export function assertNull(actual) {
  return actual === null
    ? LOGGER.test("Test passed")
    : LOGGER.testFailed("Test failed", actual);
}
