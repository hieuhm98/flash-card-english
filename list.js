// ============================================
// Flashcard List Application
// ============================================

class FlashcardList {
  constructor() {
    this.flashcards = [];
    this.filteredFlashcards = [];
    this.currentFilter = "all";

    // Pagination
    this.currentPage = 1;
    this.itemsPerPage = 20; // Show 20 cards per page
    this.totalPages = 1;

    // DOM Elements
    this.searchInput = document.getElementById("searchInput");
    this.clearBtn = document.getElementById("clearBtn");
    this.searchStats = document.getElementById("searchStats");
    this.flashcardsGrid = document.getElementById("flashcardsGrid");

    // Pagination elements
    this.paginationContainer = document.getElementById("paginationContainer");
    this.pageInfo = document.getElementById("pageInfo");
    this.firstPageBtn = document.getElementById("firstPageBtn");
    this.prevPageBtn = document.getElementById("prevPageBtn");
    this.nextPageBtn = document.getElementById("nextPageBtn");
    this.lastPageBtn = document.getElementById("lastPageBtn");

    this.init();
  }

  async init() {
    // Load flashcards from JSON file
    await this.loadFlashcards();

    // Event Listeners
    this.searchInput.addEventListener("input", () => this.handleSearch());
    this.clearBtn.addEventListener("click", () => this.clearSearch());

    // Pagination event listeners
    this.firstPageBtn.addEventListener("click", () => this.goToPage(1));
    this.prevPageBtn.addEventListener("click", () =>
      this.goToPage(this.currentPage - 1),
    );
    this.nextPageBtn.addEventListener("click", () =>
      this.goToPage(this.currentPage + 1),
    );
    this.lastPageBtn.addEventListener("click", () =>
      this.goToPage(this.totalPages),
    );

    // Display all cards initially
    this.displayCards();
  }

  async loadFlashcards() {
    try {
      const response = await fetch("flashcards.json");
      if (!response.ok) {
        throw new Error("Failed to load flashcards");
      }
      this.flashcards = await response.json();
      this.filteredFlashcards = [...this.flashcards];
      this.updateStats();
    } catch (error) {
      console.error("Error loading flashcards:", error);
      this.showError();
    }
  }

  handleSearch() {
    const query = this.searchInput.value.toLowerCase().trim();

    // Show/hide clear button
    if (query) {
      this.clearBtn.classList.add("visible");
    } else {
      this.clearBtn.classList.remove("visible");
    }

    // Filter flashcards
    if (query === "") {
      this.filteredFlashcards = [...this.flashcards];
    } else {
      this.filteredFlashcards = this.flashcards.filter((card) => {
        const front = card.front?.toLowerCase() || "";
        const back = card.back?.toLowerCase() || "";
        const pronunciation = card.pronunciation?.toLowerCase() || "";

        return (
          front.includes(query) ||
          back.includes(query) ||
          pronunciation.includes(query)
        );
      });
    }

    this.applyCurrentFilter();
    this.currentPage = 1; // Reset to first page
    this.displayCards();
    this.updateStats();
  }

  clearSearch() {
    this.searchInput.value = "";
    this.clearBtn.classList.remove("visible");
    this.filteredFlashcards = [...this.flashcards];
    this.applyCurrentFilter();
    this.displayCards();
    this.updateStats();
    this.searchInput.focus();
  }

  applyCurrentFilter() {
    // No filters currently active
  }

  displayCards() {
    if (this.filteredFlashcards.length === 0) {
      this.showEmptyState();
      this.paginationContainer.style.display = "none";
      return;
    }

    // Calculate pagination
    this.totalPages = Math.ceil(
      this.filteredFlashcards.length / this.itemsPerPage,
    );

    // Ensure current page is valid
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }

    // Get cards for current page
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const cardsToDisplay = this.filteredFlashcards.slice(startIndex, endIndex);

    // Clear and render cards
    this.flashcardsGrid.innerHTML = "";

    cardsToDisplay.forEach((card, index) => {
      const cardElement = this.createCardElement(card, startIndex + index);
      this.flashcardsGrid.appendChild(cardElement);
    });

    // Update pagination controls
    this.updatePaginationControls();
    this.paginationContainer.style.display = "flex";

    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  createCardElement(card, index) {
    const cardDiv = document.createElement("div");
    cardDiv.className = "flashcard-item";
    cardDiv.innerHTML = `
      <div class="flashcard-item-inner">
        <div class="card-face card-front">
          <div class="card-header">
            <span class="card-label">Word</span>
          </div>
          <div class="card-word">${this.escapeHtml(card.front)}</div>
          ${card.pronunciation ? `<div class="card-pronunciation">${this.escapeHtml(card.pronunciation)}</div>` : ""}
          <div class="card-flip-hint">Click to see meaning</div>
        </div>
        <div class="card-face card-back">
          <div class="card-header">
            <span class="card-label">Meaning</span>
          </div>
          <div class="card-meaning">${this.escapeHtml(card.back)}</div>
          <div class="card-flip-hint">Click to flip back</div>
        </div>
      </div>
    `;

    // Add flip functionality
    cardDiv.addEventListener("click", () => {
      cardDiv.classList.toggle("flipped");
    });

    return cardDiv;
  }

  updateStats() {
    const total = this.flashcards.length;
    const showing = this.filteredFlashcards.length;
    const query = this.searchInput.value.trim();

    if (query) {
      this.searchStats.textContent = `Showing ${showing} of ${total} flashcards`;
    } else {
      this.searchStats.textContent = `${total} flashcard${total !== 1 ? "s" : ""} available`;
    }
  }

  showEmptyState() {
    const query = this.searchInput.value.trim();
    const message = query
      ? `No flashcards found for "${query}"`
      : "No flashcards available";

    this.flashcardsGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <div class="empty-state-text">${message}</div>
      </div>
    `;
  }

  showError() {
    this.flashcardsGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <div class="empty-state-text">Error loading flashcards. Please check that flashcards.json exists.</div>
      </div>
    `;
    this.searchStats.textContent = "Error loading flashcards";
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // Pagination methods
  goToPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > this.totalPages) {
      return;
    }
    this.currentPage = pageNumber;
    this.displayCards();
  }

  updatePaginationControls() {
    // Update page info
    this.pageInfo.textContent = `Page ${this.currentPage} of ${this.totalPages}`;

    // Update button states
    this.firstPageBtn.disabled = this.currentPage === 1;
    this.prevPageBtn.disabled = this.currentPage === 1;
    this.nextPageBtn.disabled = this.currentPage === this.totalPages;
    this.lastPageBtn.disabled = this.currentPage === this.totalPages;
  }
}

// Initialize the app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new FlashcardList();
  });
} else {
  new FlashcardList();
}
