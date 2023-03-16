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
  const aElement = document.createElement("a");
  aElement.classList.add("list-group-item");
  aElement.classList.add("d-flex");
  aElement.classList.add("justify-content-between");
  aElement.classList.add("align-items-center");
  const url = new URL(content.link, window.location.origin);
  aElement.href = url.toString();
  // aElement.innerHTML = content.title;

  const titleElement = document.createElement("span");
  titleElement.innerHTML = content.title;
  aElement.appendChild(titleElement);

  const priorityElement = document.createElement("span");
  priorityElement.style.color = "gray";
  priorityElement.style.fontSize = "0.5rem";
  priorityElement.textContent = `Priority: ${content.priority}`;
  aElement.appendChild(priorityElement);
  return aElement;
}
