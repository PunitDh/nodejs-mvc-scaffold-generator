window.onload = () => {
  const searchBar = document.getElementById("search-bar");
  const searchSuggestionsList = searchSuggestions();

  searchBar?.addEventListener("keyup", async () =>
    handleSearchSuggestions(searchSuggestionsList, searchBar)
  );
  searchBar?.addEventListener("focus", async () =>
    handleSearchSuggestions(searchSuggestionsList, searchBar)
  );
  searchBar?.addEventListener("blur", () => {
    searchSuggestionsList.hide();
  });
};

async function handleSearchSuggestions(searchSuggestionsList, searchBar) {
  const results = await fetchSearchSuggestions(searchBar.value);
  searchSuggestionsList.clear();
  results.forEach((result) =>
    searchSuggestionsList.add(createListElement(result, searchBar.value))
  );
  searchSuggestionsList.show();
}

function searchSuggestions() {
  const suggestionsList = document.getElementById("search-suggestions-list");
  let mouseEntered = false;
  suggestionsList?.addEventListener("mouseenter", () => {
    mouseEntered = true;
  });
  suggestionsList?.addEventListener("mouseleave", () => {
    mouseEntered = false;
  });
  return {
    show: function () {
      suggestionsList.classList.remove("d-none");
    },
    hide: function () {
      if (!mouseEntered) {
        suggestionsList.classList.add("d-none");
      }
    },
    add: function (listElement) {
      suggestionsList.appendChild(listElement);
    },
    clear: function () {
      while (suggestionsList.firstChild) {
        suggestionsList.removeChild(suggestionsList.lastChild);
      }
    },
  };
}

async function fetchSearchSuggestions(searchTerm) {
  try {
    const fetchResponse = await window.fetch(`/api/search?q=${searchTerm}`);
    const jsonResponse = await fetchResponse.json();
    return jsonResponse;
  } catch (err) {
    return console.error(err);
  }
}

function createListElement(content) {
  const listElement = document.createElement("a");
  listElement.classList.add("list-group-item");
  const url = new URL(content.link, window.location.origin);
  listElement.href = url.toString();
  listElement.innerHTML = content.title;
  return listElement;
}
