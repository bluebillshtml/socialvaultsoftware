/**
 * SocialVault - Social Media Downloader Functionality
 * This script adds download functionality to the HTML page
 */

// API Base URL (adjust if needed)
const API_BASE = window.location.origin;

// State management
const state = {
  currentUrl: '',
  platform: null,
  metadata: null,
  formats: [],
  qualities: [],
  isLoading: false,
  error: null
};

// Initialize the app
function initSocialVault() {
  console.log('SocialVault initialized');
  
  // Find the input field and add event listeners
  const inputField = document.querySelector('textarea[placeholder*="Generate"]');
  if (inputField) {
    // Change placeholder
    inputField.placeholder = 'Paste a social media URL here (YouTube, TikTok, Instagram, Reddit, etc.)...';
    
    // Add input event listener
    inputField.addEventListener('input', handleInputChange);
    inputField.addEventListener('paste', handlePaste);
  }
  
  // Find the submit button
  const submitButton = document.querySelector('button svg[data-solar="arrow-right-bold-duotone"]')?.closest('button');
  if (submitButton) {
    submitButton.addEventListener('click', handleSubmit);
  }
}

// Handle input changes
function handleInputChange(e) {
  state.currentUrl = e.target.value.trim();
  state.error = null;
}

// Handle paste event
function handlePaste(e) {
  setTimeout(() => {
    state.currentUrl = e.target.value.trim();
    if (state.currentUrl) {
      handleSubmit();
    }
  }, 100);
}

// Handle form submission
async function handleSubmit(e) {
  if (e) e.preventDefault();
  
  if (!state.currentUrl) {
    showError('Please enter a URL');
    return;
  }
  
  // Validate URL
  if (!isValidUrl(state.currentUrl)) {
    showError('Please enter a valid URL');
    return;
  }
  
  setLoading(true);
  
  try {
    // Step 1: Detect platform
    const platform = await detectPlatform(state.currentUrl);
    state.platform = platform;
    
    // Step 2: Fetch metadata
    const metadata = await fetchMetadata(state.currentUrl, platform);
    state.metadata = metadata;
    
    // Step 3: Fetch available formats
    const formats = await fetchFormats(state.currentUrl, platform);
    state.formats = formats.formats || [];
    state.qualities = formats.qualities || [];
    
    // Step 4: Display results
    displayResults();
    
  } catch (error) {
    showError(error.message || 'Failed to process URL');
  } finally {
    setLoading(false);
  }
}

// Validate URL
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Detect platform
async function detectPlatform(url) {
  const response = await fetch(`${API_BASE}/api/detect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error?.message || 'Failed to detect platform');
  }
  
  return data.platform;
}

// Fetch metadata
async function fetchMetadata(url, platform) {
  const response = await fetch(`${API_BASE}/api/metadata`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, platform })
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error?.message || 'Failed to fetch metadata');
  }
  
  return data.metadata;
}

// Fetch available formats
async function fetchFormats(url, platform) {
  const response = await fetch(`${API_BASE}/api/formats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, platform })
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error?.message || 'Failed to fetch formats');
  }
  
  return data;
}

// Initiate download
async function initiateDownload(format, quality = null) {
  setLoading(true);
  
  try {
    const response = await fetch(`${API_BASE}/api/download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: state.currentUrl,
        platform: state.platform,
        format,
        quality
      })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error?.message || 'Failed to initiate download');
    }
    
    // Open download URL in new tab
    if (data.downloadUrl) {
      window.open(data.downloadUrl, '_blank');
      showSuccess('Download started!');
    }
    
  } catch (error) {
    showError(error.message || 'Download failed');
  } finally {
    setLoading(false);
  }
}

// Display results
function displayResults() {
  const container = document.querySelector('.z-10.w-full.max-w-3xl');
  if (!container) return;
  
  // Create results HTML
  const resultsHTML = `
    <div class="mt-8 space-y-6" id="socialvault-results">
      <!-- Platform Badge -->
      <div class="flex items-center gap-3">
        <div class="px-4 py-2 bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 text-sm font-medium rounded-none">
          ${state.platform.toUpperCase()}
        </div>
      </div>
      
      <!-- Metadata Card -->
      <div class="bg-zinc-950 border border-white/10 p-6 space-y-4">
        <div class="flex gap-4">
          ${state.metadata.thumbnail ? `
            <img src="${state.metadata.thumbnail}" alt="Thumbnail" class="w-32 h-32 object-cover border border-white/10" />
          ` : ''}
          <div class="flex-1">
            <h3 class="text-white text-lg font-medium mb-2">${escapeHtml(state.metadata.title)}</h3>
            <p class="text-zinc-400 text-sm mb-2">By ${escapeHtml(state.metadata.author)}</p>
            ${state.metadata.duration ? `
              <p class="text-zinc-500 text-xs">Duration: ${formatDuration(state.metadata.duration)}</p>
            ` : ''}
          </div>
        </div>
      </div>
      
      <!-- Download Options -->
      <div class="bg-zinc-950 border border-white/10 p-6 space-y-4">
        <h4 class="text-white text-md font-medium mb-4">Download Options</h4>
        
        <div class="grid grid-cols-2 gap-4">
          ${state.formats.map(format => `
            <button 
              onclick="initiateDownload('${format.type}')"
              class="bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-cyan-500/50 px-6 py-4 text-white text-sm font-medium transition-all flex items-center justify-center gap-2"
            >
              <span>${format.label}</span>
            </button>
          `).join('')}
        </div>
        
        ${state.qualities.length > 0 ? `
          <div class="mt-4">
            <label class="text-zinc-400 text-sm mb-2 block">Quality:</label>
            <select id="quality-select" class="w-full bg-zinc-900 border border-white/10 text-white px-4 py-2 text-sm">
              ${state.qualities.map(q => `
                <option value="${q.value}" ${q.available ? '' : 'disabled'}>
                  ${q.label} ${q.available ? '' : '(Not Available)'}
                </option>
              `).join('')}
            </select>
          </div>
        ` : ''}
      </div>
    </div>
  `;
  
  // Remove existing results
  const existingResults = document.getElementById('socialvault-results');
  if (existingResults) {
    existingResults.remove();
  }
  
  // Insert results
  container.insertAdjacentHTML('beforeend', resultsHTML);
}

// Set loading state
function setLoading(loading) {
  state.isLoading = loading;
  
  const submitButton = document.querySelector('button svg[data-solar="arrow-right-bold-duotone"]')?.closest('button');
  if (submitButton) {
    if (loading) {
      submitButton.disabled = true;
      submitButton.style.opacity = '0.5';
      submitButton.style.cursor = 'not-allowed';
    } else {
      submitButton.disabled = false;
      submitButton.style.opacity = '1';
      submitButton.style.cursor = 'pointer';
    }
  }
  
  // Show/hide loading indicator
  showLoadingIndicator(loading);
}

// Show loading indicator
function showLoadingIndicator(show) {
  let indicator = document.getElementById('socialvault-loading');
  
  if (show && !indicator) {
    const container = document.querySelector('.z-10.w-full.max-w-3xl');
    if (container) {
      const html = `
        <div id="socialvault-loading" class="mt-8 bg-zinc-950 border border-white/10 p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          <p class="text-zinc-400 text-sm mt-4">Processing...</p>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', html);
    }
  } else if (!show && indicator) {
    indicator.remove();
  }
}

// Show error message
function showError(message) {
  state.error = message;
  
  // Remove existing error
  const existingError = document.getElementById('socialvault-error');
  if (existingError) {
    existingError.remove();
  }
  
  // Show new error
  const container = document.querySelector('.z-10.w-full.max-w-3xl');
  if (container) {
    const html = `
      <div id="socialvault-error" class="mt-8 bg-red-950/20 border border-red-500/30 p-6 text-center">
        <p class="text-red-400 text-sm">${escapeHtml(message)}</p>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      const errorEl = document.getElementById('socialvault-error');
      if (errorEl) errorEl.remove();
    }, 5000);
  }
}

// Show success message
function showSuccess(message) {
  const container = document.querySelector('.z-10.w-full.max-w-3xl');
  if (container) {
    const html = `
      <div id="socialvault-success" class="mt-8 bg-green-950/20 border border-green-500/30 p-6 text-center">
        <p class="text-green-400 text-sm">${escapeHtml(message)}</p>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      const successEl = document.getElementById('socialvault-success');
      if (successEl) successEl.remove();
    }, 3000);
  }
}

// Utility: Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Utility: Format duration
function formatDuration(seconds) {
  if (!seconds) return 'Unknown';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSocialVault);
} else {
  initSocialVault();
}

// Export functions to global scope for onclick handlers
window.initiateDownload = initiateDownload;
