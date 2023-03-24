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
    searchSuggestionsList.add(createSearchElement(result, searchBar.value))
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
    return await fetchResponse.json();
  } catch (err) {
    return console.error(err);
  }
}

function createSearchElement(content) {
  const linkElement = document.createElement("a");
  linkElement.classList.add("list-group-item");
  linkElement.classList.add("d-flex");
  linkElement.classList.add("justify-content-between");
  linkElement.classList.add("align-items-center");

  const url = new URL(content.link, window.location.origin);
  linkElement.href = url.toString();

  const titleElement = document.createElement("span");
  titleElement.innerHTML = content.title;
  linkElement.appendChild(titleElement);

  const priorityElement = document.createElement("span");
  priorityElement.style.color = "gray";
  priorityElement.style.fontSize = "0.5rem";
  priorityElement.textContent = `Priority: ${content.priority}`;
  linkElement.appendChild(priorityElement);
  return linkElement;
}
