// ===== Configuration =====
const GEMINI_API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your actual Gemini API key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// ===== State Management =====
let isGenerating = false;

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Load saved API key from localStorage if available
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
        // API key is loaded silently
    }
});

// ===== Main Functions =====

/**
 * Generate email response using Gemini AI
 */
async function generateResponse() {
    if (isGenerating) return;

    // Get form values
    const incomingEmail = document.getElementById('incomingEmail').value.trim();
    const responseIntent = document.getElementById('responseIntent').value.trim();
    const responseTone = document.getElementById('responseTone').value;

    // Validate inputs
    if (!incomingEmail || !responseIntent) {
        showError('Please provide both the email text and your intended response.');
        return;
    }

    // Hide error if shown
    hideError();

    // Check for API key (only strict check if running locally)
    const isLocal = window.location.hostname === 'localhost' || window.location.protocol === 'file:';
    if (isLocal && GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
        showError('Please add your Gemini API key in the app.js file. Get one at https://makersuite.google.com/app/apikey');
        return;
    }

    // Show loading state
    showLoadingState(responseTone);

    try {
        isGenerating = true;

        // Create the prompt
        const prompt = createPrompt(incomingEmail, responseIntent, responseTone);

        // Call Gemini API
        const response = await callGeminiAPI(prompt);

        // Parse and display result
        const result = parseGeminiResponse(response);
        showResult(result);

    } catch (error) {
        console.error('Error generating response:', error);
        showError(error.message || 'Failed to generate response. Please try again.');
        showEmptyState();
    } finally {
        isGenerating = false;
    }
}

/**
 * Create prompt for Gemini AI
 */
function createPrompt(incomingEmail, responseIntent, tone) {
    return `You are an expert email writer. Generate a professional email response based on the following:

INCOMING EMAIL:
${incomingEmail}

RESPONSE INTENT:
${responseIntent}

TONE:
${tone}

Please generate:
1. A suitable subject line (if replying, use "Re: [original subject]" format, or create an appropriate subject)
2. A complete email body with proper greeting, main content, and closing

Format your response EXACTLY as follows:
SUBJECT: [your subject line here]

BODY:
[your email body here]

Important guidelines:
- Match the requested tone: ${tone}
- Be professional and clear
- Keep it concise but complete
- Include appropriate greeting and sign-off
- Make sure the response directly addresses the intent: ${responseIntent}`;
}

/**
 * Call Gemini API
 */
/**
 * Call Gemini API
 * Supports both direct client-side (local dev) and Vercel serverless (production)
 */
async function callGeminiAPI(prompt) {
    const payload = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }],
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
        }
    };

    // Determine environment
    const isLocal = window.location.hostname === 'localhost' || window.location.protocol === 'file:';

    let url, options;

    if (isLocal && GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_API_KEY_HERE') {
        // Local Dev: Call Google Direct
        url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
        options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        };
    } else {
        // Production (Vercel): Call Internal API Proxy
        url = '/api/generate';
        options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        };
    }

    const response = await fetch(url, options);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'API request failed');
    }

    return await response.json();
}

/**
 * Parse Gemini API response
 */
function parseGeminiResponse(response) {
    try {
        const text = response.candidates[0].content.parts[0].text;

        // Extract subject and body
        const subjectMatch = text.match(/SUBJECT:\s*(.+?)(?:\n|$)/i);
        const bodyMatch = text.match(/BODY:\s*([\s\S]+)/i);

        let subject = subjectMatch ? subjectMatch[1].trim() : 'Re: Your Email';
        let body = bodyMatch ? bodyMatch[1].trim() : text;

        // Clean up the body
        body = body.replace(/^BODY:\s*/i, '').trim();

        return { subject, body };
    } catch (error) {
        throw new Error('Failed to parse AI response');
    }
}

/**
 * Reset form to initial state
 */
function resetForm() {
    document.getElementById('incomingEmail').value = '';
    document.getElementById('responseIntent').value = '';
    document.getElementById('responseTone').selectedIndex = 0;
    hideError();
    showEmptyState();
}

/**
 * Copy text to clipboard
 */
async function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.value;

    try {
        await navigator.clipboard.writeText(text);

        // Visual feedback
        const button = event.target.closest('button');
        const originalHTML = button.innerHTML;
        button.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 13l4 4L19 7"/>
            </svg>
            ${elementId === 'resultBody' ? 'Copied!' : ''}
        `;
        button.style.background = 'var(--success-50)';
        button.style.borderColor = 'var(--success-600)';
        button.style.color = 'var(--success-600)';

        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.background = '';
            button.style.borderColor = '';
            button.style.color = '';
        }, 2000);
    } catch (error) {
        console.error('Failed to copy:', error);
        showError('Failed to copy to clipboard');
    }
}

// ===== UI State Management =====

/**
 * Show loading state
 */
function showLoadingState(tone) {
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('resultState').style.display = 'none';
    document.getElementById('loadingState').style.display = 'flex';
    document.getElementById('statusBadge').style.display = 'none';
    document.getElementById('loadingTone').textContent = tone.toLowerCase();

    // Update button state
    const btn = document.getElementById('generateBtn');
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Crafting...';
    btn.querySelector('.btn-icon').style.display = 'none';
    btn.querySelector('.spinner').style.display = 'block';
}

/**
 * Show empty state
 */
function showEmptyState() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('resultState').style.display = 'none';
    document.getElementById('emptyState').style.display = 'flex';
    document.getElementById('statusBadge').style.display = 'none';

    // Reset button state
    const btn = document.getElementById('generateBtn');
    btn.disabled = false;
    btn.querySelector('span').textContent = 'Craft Response';
    btn.querySelector('.btn-icon').style.display = 'block';
    btn.querySelector('.spinner').style.display = 'none';
}

/**
 * Show result state
 */
function showResult(result) {
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('resultState').style.display = 'flex';
    document.getElementById('statusBadge').style.display = 'inline-block';

    // Populate results
    document.getElementById('resultSubject').value = result.subject;
    document.getElementById('resultBody').value = result.body;

    // Reset button state
    const btn = document.getElementById('generateBtn');
    btn.disabled = false;
    btn.querySelector('span').textContent = 'Craft Response';
    btn.querySelector('.btn-icon').style.display = 'block';
    btn.querySelector('.spinner').style.display = 'none';
}

/**
 * Show error message
 */
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    errorText.textContent = message;
    errorDiv.style.display = 'flex';

    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideError();
    }, 5000);
}

/**
 * Hide error message
 */
function hideError() {
    document.getElementById('errorMessage').style.display = 'none';
}

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to generate
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        generateResponse();
    }

    // Escape to reset
    if (e.key === 'Escape') {
        resetForm();
    }
});
