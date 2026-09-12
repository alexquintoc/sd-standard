(function () {
  function updateHeaderHeight(header) {
    document.documentElement.style.setProperty(
      "--sd-site-nav-height",
      `${Math.ceil(header.getBoundingClientRect().height)}px`,
    );
  }

  function initKnowledgeBaseHeader() {
    if (document.querySelector("[data-sd-kb-header]")) return;

    const header = document.createElement("header");
    header.setAttribute("data-sd-kb-header", "");

    const inner = document.createElement("div");

    const brand = document.createElement("a");
    brand.href = "/knowledge-base/";
    brand.textContent = "SD Standard Knowledge Base";

    const website = document.createElement("a");
    website.href = "https://sdstandard.org/";
    website.textContent = "SD Standard website →";

    inner.append(brand, website);
    header.appendChild(inner);

    const bodyContainer = document.getElementById("mdbook-body-container");
    document.body.insertBefore(header, bodyContainer || document.body.firstChild);
    updateHeaderHeight(header);

    if ("ResizeObserver" in window) {
      new ResizeObserver(() => updateHeaderHeight(header)).observe(header);
    } else {
      window.addEventListener("resize", () => updateHeaderHeight(header));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initKnowledgeBaseHeader);
  } else {
    initKnowledgeBaseHeader();
  }
})();
