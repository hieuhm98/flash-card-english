# 📚 English Flashcards - Interactive Learning App

A beautiful, modern flashcard application for learning English with 3D flip animations, keyboard shortcuts, and progress tracking.

## ✨ Features

- 🎨 **Premium Design** - Vibrant gradients, glassmorphism effects, and smooth animations
- 🔄 **3D Flip Animation** - Interactive card flipping with stunning visual effects
- ⌨️ **Keyboard Shortcuts** - Navigate efficiently with keyboard controls
- 📊 **Progress Tracking** - Visual progress bar and persistent state
- 🔀 **Shuffle Mode** - Randomize cards for better learning
- 📱 **Fully Responsive** - Works perfectly on mobile, tablet, and desktop
- 💾 **Auto-Save** - Your progress is automatically saved

## 🎮 How to Use

### Keyboard Shortcuts
- **Space** - Flip the current card
- **→ (Right Arrow)** - Next card
- **← (Left Arrow)** - Previous card
- **S** - Shuffle cards

### Mouse/Touch
- Click on the card to flip it
- Use the navigation buttons to move between cards
- Click "Shuffle" to randomize the deck

## 📝 Adding Your Flashcard Content

### Option 1: Update the JSON file (Recommended)

1. Open `flashcards.json`
2. Add your flashcards in this format:
```json
[
    {
        "front": "Word or phrase",
        "back": "Definition or translation"
    }
]
```

### Option 2: Extract from .doc files

Once you add your `.doc` files to the project:

1. We'll extract the content from both files
2. The first file will be used for the "front" of cards
3. The second file will be used for the "back" of cards
4. The data will be automatically formatted into `flashcards.json`

## 🚀 Deploying to Vercel (Free)

### Method 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd c:\Users\Admin\Desktop\project\flash-card-english
   vercel
   ```

3. **Follow the prompts:**
   - Login to Vercel (or create a free account)
   - Confirm project settings
   - Deploy!

### Method 2: Using Vercel Website

1. Go to [vercel.com](https://vercel.com)
2. Sign up for a free account
3. Click "Add New Project"
4. Import your project:
   - Upload the folder, OR
   - Connect to GitHub (if you push your code there)
5. Click "Deploy"

Your site will be live at: `https://your-project-name.vercel.app`

## 📁 Project Structure

```
flash-card-english/
├── index.html          # Main HTML structure
├── styles.css          # Premium styling and animations
├── script.js           # Application logic
├── flashcards.json     # Your flashcard data
└── README.md           # This file
```

## 🎨 Customization

### Change Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    /* ... more colors */
}
```

### Modify Card Size
In `styles.css`, find `.flashcard` and adjust the height:
```css
.flashcard {
    height: 400px; /* Change this value */
}
```

## 🔧 Technical Details

- **Pure Vanilla JavaScript** - No frameworks, fast loading
- **CSS3 Animations** - Smooth 60fps animations
- **LocalStorage** - Progress persistence
- **Responsive Design** - Mobile-first approach
- **SEO Optimized** - Proper meta tags and semantic HTML

## 💡 Tips for Learning

- Review cards regularly for better retention
- Use shuffle mode to test your knowledge
- Focus on cards you find difficult
- Practice daily for best results

## 📄 License

Free to use for personal and educational purposes.

---

Made with ❤️ for English learners
