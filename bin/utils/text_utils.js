import MarkedSearchResult from "../domain/MarkedSearchResult.js";
import SETTINGS from "./settings.js";

/**
 * @description Marks occurrences of a search term in HTML text by wrapping them in <span> tags with a "mark" class.
 * @param {String} text - The HTML text to search in.
 * @param {String} term - The search term to mark.
 * @param {Number} maxStringLength - The maximum length of the resulting text, after which it will be shortened and appended with "...".
 * @returns {Object} An object containing the marked HTML text and the number of occurrences of the search term.
 */
function markHTML(text, term, maxStringLength) {
  const regex = new RegExp(`(${term})`, "gi");
  const stringified = text?.toString();
  const count = (stringified?.match(regex) || []).length;
  const shortenedText =
    stringified?.length > maxStringLength
      ? stringified?.slice(0, maxStringLength) + "..."
      : stringified;
  return {
    text: shortenedText?.replace(regex, "<span class='mark'>$1</span>"),
    count,
  };
}

/**
 *
 * @description Marks the search term in the values of the given object's properties
 * and returns the result object with the marked search term.
 * The function uses markHTML to mark the term in the object's values and
 * exclude searchResultExcludedColumns from the search.
 * It also calculates a priority for each match based on the count of marked terms in the value.
 * @param {Object} dataObject The object whose properties will be searched for the given term.
 * @param {String} searchTerm The search term that will be marked in the values of the object's properties.
 * @param {Boolean} shortened: Whether to shorten the result
 * @returns {MarkedSearchResult} An object with the priority of the search term in the values and the marked search term in the result object.
 */
export function markSearchTerm(dataObject, searchTerm, shortened = false) {
  if (!searchTerm) return dataObject;
  const result = {};
  let priority = 0;
  const { maxStringLength, searchResultExcludedColumns } =
    SETTINGS.views.pages.search;
  dataObject
    .exclude(...searchResultExcludedColumns)
    .entries()
    .forEach(([key, value]) => {
      const { text, count } = markHTML(
        value,
        searchTerm,
        shortened ? maxStringLength : undefined
      );
      priority += count;
      result[key] = text;
    });
  return new MarkedSearchResult(result, priority);
}

export function getQueryFromURIComponent(uriComponent) {
  if (!uriComponent) return null;
  const match = uriComponent.match(/q=([^&]*)/);
  return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}
