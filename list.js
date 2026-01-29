// ============================================
// Flashcard List Application
// ============================================

class FlashcardList {
  constructor() {
    this.flashcards = [];
    this.filteredFlashcards = [];
    this.favorites = this.loadFavorites();
    this.currentFilter = "all";

    // DOM Elements
    this.searchInput = document.getElementById("searchInput");
    this.clearBtn = document.getElementById("clearBtn");
    this.searchStats = document.getElementById("searchStats");
    this.flashcardsGrid = document.getElementById("flashcardsGrid");
    this.filterBtns = document.querySelectorAll(".filter-btn");

    this.init();
  }

  async init() {
    // Load flashcards from JSON file
    await this.loadFlashcards();

    // Event Listeners
    this.searchInput.addEventListener("input", () => this.handleSearch());
    this.clearBtn.addEventListener("click", () => this.clearSearch());

    this.filterBtns.forEach((btn) => {
      btn.addEventListener("click", (e) =>
        this.handleFilter(e.target.dataset.filter),
      );
    });

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

  handleFilter(filter) {
    this.currentFilter = filter;

    // Update active button
    this.filterBtns.forEach((btn) => {
      if (btn.dataset.filter === filter) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    this.applyCurrentFilter();
    this.displayCards();
    this.updateStats();
  }

  applyCurrentFilter() {
    if (this.currentFilter === "favorites") {
      this.filteredFlashcards = this.filteredFlashcards.filter((card) =>
        this.favorites.includes(card.front),
      );
    }
  }

  displayCards() {
    if (this.filteredFlashcards.length === 0) {
      this.showEmptyState();
      return;
    }

    this.flashcardsGrid.innerHTML = "";

    this.filteredFlashcards.forEach((card, index) => {
      const cardElement = this.createCardElement(card, index);
      this.flashcardsGrid.appendChild(cardElement);
    });
  }

  createCardElement(card, index) {
    const isFavorite = this.favorites.includes(card.front);

    const cardDiv = document.createElement("div");
    cardDiv.className = "flashcard-item";
    cardDiv.innerHTML = `
      <div class="flashcard-item-inner">
        <div class="card-face card-front">
          <div class="card-header">
            <span class="card-label">Word</span>
            <button class="favorite-btn" data-word="${this.escapeHtml(card.front)}" title="Add to favorites">
              ${isFavorite ? "⭐" : "☆"}
            </button>
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
    cardDiv.addEventListener("click", (e) => {
      if (!e.target.classList.contains("favorite-btn")) {
        cardDiv.classList.toggle("flipped");
      }
    });

    // Add favorite functionality
    const favoriteBtn = cardDiv.querySelector(".favorite-btn");
    favoriteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleFavorite(card.front, favoriteBtn);
    });

    return cardDiv;
  }

  toggleFavorite(word, btn) {
    const index = this.favorites.indexOf(word);

    if (index > -1) {
      // Remove from favorites
      this.favorites.splice(index, 1);
      btn.textContent = "☆";
    } else {
      // Add to favorites
      this.favorites.push(word);
      btn.textContent = "⭐";
    }

    this.saveFavorites();

    // If currently filtering by favorites, update display
    if (this.currentFilter === "favorites") {
      this.handleSearch();
    }
  }

  loadFavorites() {
    try {
      const saved = localStorage.getItem("flashcard-favorites");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn("Could not load favorites:", e);
      return [];
    }
  }

  saveFavorites() {
    try {
      localStorage.setItem(
        "flashcard-favorites",
        JSON.stringify(this.favorites),
      );
    } catch (e) {
      console.warn("Could not save favorites:", e);
    }
  }

  updateStats() {
    const total = this.flashcards.length;
    const showing = this.filteredFlashcards.length;
    const query = this.searchInput.value.trim();

    if (query) {
      this.searchStats.textContent = `Showing ${showing} of ${total} flashcards`;
    } else if (this.currentFilter === "favorites") {
      this.searchStats.textContent = `${showing} favorite flashcard${showing !== 1 ? "s" : ""}`;
    } else {
      this.searchStats.textContent = `${total} flashcard${total !== 1 ? "s" : ""} available`;
    }
  }

  showEmptyState() {
    const query = this.searchInput.value.trim();
    const message = query
      ? `No flashcards found for "${query}"`
      : this.currentFilter === "favorites"
        ? "No favorites yet. Click the ☆ icon on any card to add it to favorites!"
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
}

// Initialize the app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new FlashcardList();
  });
} else {
  new FlashcardList();
}
