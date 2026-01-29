// ============================================
// Flashcard Application
// ============================================

class FlashcardApp {
  constructor() {
    // Flashcards will be loaded from flashcards.json
    this.flashcards = [];
    this.currentIndex = 0;
    this.isFlipped = false;

    // DOM Elements
    this.flashcard = document.getElementById("flashcard");
    this.frontContent = document.getElementById("frontContent");
    this.backContent = document.getElementById("backContent");
    this.prevBtn = document.getElementById("prevBtn");
    this.nextBtn = document.getElementById("nextBtn");
    this.shuffleBtn = document.getElementById("shuffleBtn");
    this.progressCount = document.getElementById("progressCount");
    this.progressFill = document.getElementById("progressFill");

    this.init();
  }

  async init() {
    // Load flashcards from JSON file
    await this.loadFlashcardsFromFile();

    // Load saved progress
    this.loadProgress();

    // Display first card
    this.displayCard();

    // Event Listeners
    this.flashcard.addEventListener("click", () => this.flipCard());
    this.prevBtn.addEventListener("click", () => this.previousCard());
    this.nextBtn.addEventListener("click", () => this.nextCard());
    this.shuffleBtn.addEventListener("click", () => this.shuffleCards());

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => this.handleKeyPress(e));

    // Update progress
    this.updateProgress();
  }

  async loadFlashcardsFromFile() {
    try {
      const response = await fetch("flashcards.json");
      if (!response.ok) {
        throw new Error("Failed to load flashcards");
      }
      const data = await response.json();
      this.flashcards = data;
      this.showNotification(`Loaded ${data.length} flashcards! 📚`);
    } catch (error) {
      console.error("Error loading flashcards:", error);
      this.frontContent.textContent = "Error loading flashcards";
      this.backContent.textContent = "Please check that flashcards.json exists";
    }
  }

  displayCard() {
    if (this.flashcards.length === 0) {
      this.frontContent.textContent = "No flashcards available";
      this.backContent.textContent = "Please add flashcard data";
      return;
    }

    const card = this.flashcards[this.currentIndex];
    this.frontContent.innerHTML = `${card.front}<br><small style="opacity: 0.7; font-size: 0.8em;">${card.pronunciation || ""}</small>`;
    let answers = card.back.split("|").map((answer) => answer.trim());
    this.backContent.innerHTML = answers.join("<br>");

    // Reset flip state
    if (this.isFlipped) {
      this.flashcard.classList.remove("flipped");
      this.isFlipped = false;
    }

    // Update progress
    this.updateProgress();

    // Save progress
    this.saveProgress();
  }

  flipCard() {
    this.flashcard.classList.toggle("flipped");
    this.isFlipped = !this.isFlipped;

    // Add a subtle animation feedback
    this.flashcard.style.transform = this.isFlipped
      ? "scale(1.02)"
      : "scale(1)";
    setTimeout(() => {
      this.flashcard.style.transform = "";
    }, 200);
  }

  nextCard() {
    this.currentIndex = (this.currentIndex + 1) % this.flashcards.length;
    this.displayCard();
    this.animateCardTransition("next");
  }

  previousCard() {
    this.currentIndex =
      (this.currentIndex - 1 + this.flashcards.length) % this.flashcards.length;
    this.displayCard();
    this.animateCardTransition("prev");
  }

  shuffleCards() {
    // Fisher-Yates shuffle algorithm
    for (let i = this.flashcards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.flashcards[i], this.flashcards[j]] = [
        this.flashcards[j],
        this.flashcards[i],
      ];
    }

    this.currentIndex = 0;
    this.displayCard();

    // Visual feedback
    this.shuffleBtn.style.transform = "rotate(360deg)";
    setTimeout(() => {
      this.shuffleBtn.style.transform = "";
    }, 600);

    this.showNotification("Cards shuffled! 🔀");
  }

  updateProgress() {
    const current = this.currentIndex + 1;
    const total = this.flashcards.length;
    const percentage = (current / total) * 100;

    this.progressCount.textContent = `${current} / ${total}`;
    this.progressFill.style.width = `${percentage}%`;
  }

  handleKeyPress(e) {
    switch (e.key) {
      case " ":
      case "Spacebar":
        e.preventDefault();
        this.flipCard();
        break;
      case "ArrowRight":
        e.preventDefault();
        this.nextCard();
        break;
      case "ArrowLeft":
        e.preventDefault();
        this.previousCard();
        break;
      case "s":
      case "S":
        e.preventDefault();
        this.shuffleCards();
        break;
    }
  }

  animateCardTransition(direction) {
    const offset = direction === "next" ? "20px" : "-20px";
    this.flashcard.style.transform = `translateX(${offset})`;
    this.flashcard.style.opacity = "0.5";

    setTimeout(() => {
      this.flashcard.style.transform = "";
      this.flashcard.style.opacity = "";
    }, 200);
  }

  showNotification(message) {
    // Create notification element
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            font-weight: 600;
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;

    document.body.appendChild(notification);

    // Remove after 2 seconds
    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease-out";
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  saveProgress() {
    try {
      localStorage.setItem(
        "flashcard-progress",
        JSON.stringify({
          currentIndex: this.currentIndex,
          timestamp: new Date().toISOString(),
        }),
      );
    } catch (e) {
      console.warn("Could not save progress to localStorage:", e);
    }
  }

  loadProgress() {
    try {
      const saved = localStorage.getItem("flashcard-progress");
      if (saved) {
        const data = JSON.parse(saved);
        this.currentIndex = data.currentIndex || 0;

        // Ensure index is valid
        if (this.currentIndex >= this.flashcards.length) {
          this.currentIndex = 0;
        }
      }
    } catch (e) {
      console.warn("Could not load progress from localStorage:", e);
    }
  }

  // Method to load flashcards from external data
  loadFlashcards(data) {
    if (Array.isArray(data) && data.length > 0) {
      this.flashcards = data;
      this.currentIndex = 0;
      this.displayCard();
      this.showNotification(`Loaded ${data.length} flashcards! 📚`);
    }
  }
}

// Add notification animations to the page
const style = document.createElement("style");
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the app when DOM is ready
let app;
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    app = new FlashcardApp();
  });
} else {
  app = new FlashcardApp();
}

// Make app globally accessible for loading external data
window.flashcardApp = app;
