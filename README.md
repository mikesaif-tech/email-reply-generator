# EmailCraft AI - Email Response Generator

A beautiful, modern web application that generates professional email responses using Google's Gemini AI.

## Features

- 📧 **Smart Email Generation** - AI-powered responses tailored to your needs
- 🎨 **Modern UI** - Clean, professional design with blue tones
- 🎯 **Multiple Tones** - Choose from 9 different response styles
- 📋 **Easy Copy** - One-click copy for subject and body
- ⌨️ **Keyboard Shortcuts** - Ctrl+Enter to generate, Escape to reset
- 📱 **Responsive** - Works perfectly on all devices

## Getting Started

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure the App

1. Open `app.js` in a text editor
2. Find line 2: `const GEMINI_API_KEY = 'YOUR_API_KEY_HERE';`
3. Replace `YOUR_API_KEY_HERE` with your actual API key
4. Save the file

### 3. Run the App

Simply open `index.html` in your web browser. That's it! No installation or build process needed.

## How to Use

1. **Paste the incoming email** in the first text area
2. **Describe your response intent** (e.g., "Yes I can make the meeting")
3. **Select a tone** from the dropdown menu
4. **Click "Craft Response"** or press Ctrl+Enter
5. **Copy the generated response** and paste it into your email client

## Available Tones

- Business friendly
- Friendly and chatty
- Business concise
- Detailed
- Short and quick
- Firm but polite
- Professional and direct
- Warm and supportive
- Appreciative, respectful and open

## Keyboard Shortcuts

- `Ctrl + Enter` (or `Cmd + Enter` on Mac) - Generate response
- `Escape` - Reset form

## Technology Stack

- Pure HTML5, CSS3, and JavaScript
- Google Gemini AI API
- No frameworks or build tools required
- Works offline (except for AI generation)

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Privacy & Security

- All processing happens through Google's Gemini API
- Your API key is stored only in the JavaScript file
- No data is stored on any server
- Email content is only sent to Gemini for processing

## Tips

- Be specific with your response intent for better results
- Try different tones to find the perfect match
- Edit the generated response to add personal touches
- The AI works best with clear, complete incoming emails

## Troubleshooting

**"Please add your Gemini API key" error:**
- Make sure you've replaced `YOUR_API_KEY_HERE` in `app.js` with your actual API key

**API request failed:**
- Check your internet connection
- Verify your API key is valid
- Ensure you haven't exceeded your API quota

**Generated response doesn't match tone:**
- Try being more specific in your response intent
- Regenerate with a different tone selection

## License

Free to use for personal and commercial projects.

---

Made with ❤️ using Google Gemini AI
