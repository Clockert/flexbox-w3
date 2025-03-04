// Function to create a resource card
function createResourceCard(resource) {
  // For SVG strings or Base64
  const iconDisplay =
    resource.icon.startsWith("<svg") || resource.icon.startsWith("data:")
      ? resource.icon
      : resource.iconUrl
      ? `<img src="${resource.iconUrl}" alt="${resource.title} logo" class="resource-logo">`
      : resource.icon.startsWith("fa-")
      ? `<i class="fa ${resource.icon}"></i>`
      : resource.icon;

  return `
    <article class="resource-card">
      <div class="resource-header">
        <div class="resource-icon">${iconDisplay}</div>
        <h3>${resource.title}</h3>
      </div>
      <div class="resource-content">
        <div class="resource-categories">
          ${
            resource.categories
              ? resource.categories
                  .map(
                    (cat) =>
                      `<span class="resource-category cat-${cat.toLowerCase()}">${cat}</span>`
                  )
                  .join("")
              : `<span class="resource-category cat-${resource.category.toLowerCase()}">${
                  resource.category
                }</span>`
          }
        </div>
        <p class="resource-desc">${resource.description}</p>
        <a href="${
          resource.link
        }" class="resource-link" target="_blank">Explore ${resource.title} →</a>
      </div>
    </article>
  `;
}

// Function to load resources from JSON and populate the sections
async function loadResources() {
  const response = await fetch("resources.json");
  const data = await response.json();
  window.resourcesData = data; // Store data globally for filtering

  // Populate all resources initially
  populateResources(data);

  // Populate filter options dynamically
  populateFilterOptions(data);
}

// Function to populate resources based on data
function populateResources(data) {
  // Populate UI/UX Resources
  const uiUxSection = document.getElementById("ui-ux-resources");
  uiUxSection.innerHTML = data.uiUx
    .map((resource) => createResourceCard(resource))
    .join("");

  // Populate HTML/CSS Resources
  const htmlCssSection = document.getElementById("html-css-resources");
  htmlCssSection.innerHTML = data.htmlCss
    .map((resource) => createResourceCard(resource))
    .join("");

  // Populate JavaScript Resources
  const javascriptSection = document.getElementById("javascript-resources");
  javascriptSection.innerHTML = data.javascript
    .map((resource) => createResourceCard(resource))
    .join("");

  // Populate Tools Resources
  const toolsSection = document.getElementById("tools-resources");
  toolsSection.innerHTML = data.tools
    .map((resource) => createResourceCard(resource))
    .join("");
}

// Function to filter resources based on selected categories
function filterResources() {
  const selectedCategories = Array.from(
    document.querySelectorAll(".filter-options input:checked")
  ).map((checkbox) => checkbox.value);

  if (selectedCategories.length === 0) {
    // If no categories are selected, show all resources
    populateResources(window.resourcesData);
    return;
  }

  const filteredData = {
    uiUx: window.resourcesData.uiUx.filter((resource) =>
      resource.categories
        ? resource.categories.some((cat) => selectedCategories.includes(cat))
        : selectedCategories.includes(resource.category)
    ),
    htmlCss: window.resourcesData.htmlCss.filter((resource) =>
      resource.categories
        ? resource.categories.some((cat) => selectedCategories.includes(cat))
        : selectedCategories.includes(resource.category)
    ),
    javascript: window.resourcesData.javascript.filter((resource) =>
      resource.categories
        ? resource.categories.some((cat) => selectedCategories.includes(cat))
        : selectedCategories.includes(resource.category)
    ),
    tools: window.resourcesData.tools.filter((resource) =>
      resource.categories
        ? resource.categories.some((cat) => selectedCategories.includes(cat))
        : selectedCategories.includes(resource.category)
    ),
  };

  populateResources(filteredData);
}

// Function to populate filter options dynamically
function populateFilterOptions(data) {
  const filterOptionsContainer = document.getElementById("filter-options");

  // Collect all categories used by items
  const usedCategories = new Set();
  Object.values(data).forEach((categoryArray) => {
    categoryArray.forEach((item) => {
      if (item.categories) {
        item.categories.forEach((cat) => usedCategories.add(cat));
      } else {
        usedCategories.add(item.category);
      }
    });
  });

  // Convert Set to Array and sort alphabetically
  const sortedCategories = Array.from(usedCategories).sort();

  sortedCategories.forEach((category) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = category;
    label.appendChild(input);
    label.appendChild(document.createTextNode(` ${category}`));
    filterOptionsContainer.appendChild(label);
  });

  // Add event listeners for filter checkboxes
  document.querySelectorAll(".filter-options input").forEach((checkbox) => {
    checkbox.addEventListener("change", filterResources);
  });
}

// Load resources when the page loads
window.onload = loadResources;
