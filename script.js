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

// Load resources when the page loads
window.onload = loadResources;
