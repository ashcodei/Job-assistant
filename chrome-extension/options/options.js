/**
 * JobsAI Options Page Script
 */

// Default settings
const DEFAULT_SETTINGS = {
    enableExtension: true,
    autoDetectForms: true,
    showBubble: true,
    confidenceThreshold: 80,
    autoFillHighConfidence: true,
    showConfidenceLevel: true,
    bubblePosition: 'bottom-left',
    sidebarWidth: 320,
    theme: 'light',
    shareFeedback: true,
    allowTracking: true,
  };
  
  // DOM elements
  const elements = {
    // Form controls
    enableExtension: document.getElementById('enableExtension'),
    autoDetectForms: document.getElementById('autoDetectForms'),
    showBubble: document.getElementById('showBubble'),
    confidenceThreshold: document.getElementById('confidenceThreshold'),
    confidenceThresholdValue: document.querySelector('.range-value'),
    autoFillHighConfidence: document.getElementById('autoFillHighConfidence'),
    showConfidenceLevel: document.getElementById('showConfidenceLevel'),
    bubblePosition: document.getElementById('bubblePosition'),
    sidebarWidth: document.getElementById('sidebarWidth'),
    sidebarWidthValue: document.querySelector('.range-control .range-value'),
    theme: document.getElementById('theme'),
    shareFeedback: document.getElementById('shareFeedback'),
    allowTracking: document.getElementById('allowTracking'),
    
    // Buttons
    saveBtn: document.getElementById('save-btn'),
    resetBtn: document.getElementById('reset-btn'),
    loginBtn: document.getElementById('login-btn'),
    logoutBtn: document.getElementById('logout-btn'),
    
    // User info
    avatarInitial: document.getElementById('avatar-initial'),
    userName: document.getElementById('user-name'),
    userEmail: document.getElementById('user-email'),
    
    // Resume status
    resumeStatus: document.getElementById('resume-status'),
    
    // Notification
    saveNotification: document.getElementById('save-notification'),
  };
  
  // Initialize range input display values
  elements.confidenceThreshold.addEventListener('input', () => {
    elements.confidenceThresholdValue.textContent = `${elements.confidenceThreshold.value}%`;
  });
  
  elements.sidebarWidth.addEventListener('input', () => {
    elements.sidebarWidthValue.textContent = `${elements.sidebarWidth.value}px`;
  });
  
  // Load settings from storage
  async function loadSettings() {
    try {
      const settings = await chrome.storage.sync.get('settings');
      
      if (settings && settings.settings) {
        // Apply loaded settings to form
        applySettingsToForm(settings.settings);
      } else {
        // If no settings found, use defaults
        await saveSettings(DEFAULT_SETTINGS);
        applySettingsToForm(DEFAULT_SETTINGS);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }
  
  // Apply settings to form controls
  function applySettingsToForm(settings) {
    // Apply each setting to its corresponding form control
    for (const [key, value] of Object.entries(settings)) {
      const element = elements[key];
      
      if (element) {
        if (element.type === 'checkbox') {
          element.checked = value;
        } else if (element.type === 'range') {
          element.value = value;
          // Update displayed value
          if (key === 'confidenceThreshold') {
            elements.confidenceThresholdValue.textContent = `${value}%`;
          } else if (key === 'sidebarWidth') {
            elements.sidebarWidthValue.textContent = `${value}px`;
          }
        } else {
          element.value = value;
        }
      }
    }
  }
  
  // Get current settings from form
  function getFormSettings() {
    return {
      enableExtension: elements.enableExtension.checked,
      autoDetectForms: elements.autoDetectForms.checked,
      showBubble: elements.showBubble.checked,
      confidenceThreshold: parseInt(elements.confidenceThreshold.value),
      autoFillHighConfidence: elements.autoFillHighConfidence.checked,
      showConfidenceLevel: elements.showConfidenceLevel.checked,
      bubblePosition: elements.bubblePosition.value,
      sidebarWidth: parseInt(elements.sidebarWidth.value),
      theme: elements.theme.value,
      shareFeedback: elements.shareFeedback.checked,
      allowTracking: elements.allowTracking.checked,
    };
  }
  
  // Save settings to storage
  async function saveSettings(settings) {
    try {
      await chrome.storage.sync.set({ settings });
      
      // Broadcast settings update to other parts of the extension
      chrome.runtime.sendMessage({ action: 'settingsUpdated', settings });
      
      // Show save notification
      showNotification('Settings saved successfully!');
      
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  }
  
  // Show notification
  function showNotification(message) {
    elements.saveNotification.querySelector('.notification-message').textContent = message;
    elements.saveNotification.classList.add('show');
    
    setTimeout(() => {
      elements.saveNotification.classList.remove('show');
    }, 3000);
  }
  
  // Reset settings to defaults
  async function resetSettings() {
    try {
      await saveSettings(DEFAULT_SETTINGS);
      applySettingsToForm(DEFAULT_SETTINGS);
      showNotification('Settings reset to default!');
    } catch (error) {
      console.error('Error resetting settings:', error);
    }
  }
  
  // Load user authentication status
  async function loadAuthStatus() {
    try {
      const data = await chrome.storage.local.get(['isAuthenticated', 'userProfile']);
      
      if (data.isAuthenticated && data.userProfile) {
        updateUserUI(data.userProfile);
        loadResumeStatus();
      } else {
        updateUserUI(null);
      }
    } catch (error) {
      console.error('Error loading auth status:', error);
      updateUserUI(null);
    }
  }
  
  // Update UI based on user authentication status
  function updateUserUI(userProfile) {
    if (userProfile) {
      // User is logged in
      elements.userName.textContent = userProfile.name || 'User';
      elements.userEmail.textContent = userProfile.email || '';
      elements.avatarInitial.textContent = userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U';
      
      // Show logout button, hide login button
      elements.loginBtn.style.display = 'none';
      elements.logoutBtn.style.display = 'block';
    } else {
      // User is not logged in
      elements.userName.textContent = 'Not logged in';
      elements.userEmail.textContent = '';
      elements.avatarInitial.textContent = '?';
      
      // Show login button, hide logout button
      elements.loginBtn.style.display = 'block';
      elements.logoutBtn.style.display = 'none';
      
      // Update resume status
      elements.resumeStatus.innerHTML = `
        <p class="status-message">Please login to access your resume</p>
      `;
    }
  }
  
  // Load resume status
  async function loadResumeStatus() {
    try {
      const userProfile = await chrome.storage.local.get('userProfile');
      
      if (userProfile && userProfile.userProfile && userProfile.userProfile.hasResume) {
        // User has a resume
        elements.resumeStatus.innerHTML = `
          <p class="status-message" style="color: #10B981;">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-1" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            Resume uploaded and processed
          </p>
        `;
      } else {
        // User doesn't have a resume
        elements.resumeStatus.innerHTML = `
          <p class="status-message" style="color: #F59E0B;">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-1" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            No resume uploaded
          </p>
        `;
      }
    } catch (error) {
      console.error('Error loading resume status:', error);
      elements.resumeStatus.innerHTML = `
        <p class="status-message">Error loading resume status</p>
      `;
    }
  }
  
  // Handle login button click
  function handleLogin() {
    // Open login page
    chrome.runtime.sendMessage({ action: 'openLogin' });
  }
  
  // Handle logout button click
  async function handleLogout() {
    try {
      // Get auth token
      const data = await chrome.storage.local.get(['authToken']);
      
      if (data.authToken) {
        try {
          // Send logout request to server
          await fetch('http://localhost:3000/api/auth/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.authToken}`
            }
          });
        } catch (error) {
          console.error('Error logging out on server:', error);
        }
      }
      
      // Clear local storage
      await chrome.storage.local.remove(['isAuthenticated', 'userProfile', 'authToken']);
      
      // Update UI
      updateUserUI(null);
      
      showNotification('Logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
  
  // Event listeners
  document.addEventListener('DOMContentLoaded', () => {
    // Load settings and auth status
    loadSettings();
    loadAuthStatus();
    
    // Save button
    elements.saveBtn.addEventListener('click', async () => {
      const settings = getFormSettings();
      const success = await saveSettings(settings);
      
      if (success) {
        showNotification('Settings saved successfully!');
      } else {
        showNotification('Error saving settings!');
      }
    });
    
    // Reset button
    elements.resetBtn.addEventListener('click', resetSettings);
    
    // Login button
    elements.loginBtn.addEventListener('click', handleLogin);
    
    // Logout button
    elements.logoutBtn.addEventListener('click', handleLogout);
    
    // Enable/disable related controls based on main toggle
    elements.enableExtension.addEventListener('change', () => {
      const isEnabled = elements.enableExtension.checked;
      
      // Enable/disable related controls
      elements.autoDetectForms.disabled = !isEnabled;
      elements.showBubble.disabled = !isEnabled;
      elements.confidenceThreshold.disabled = !isEnabled;
      elements.autoFillHighConfidence.disabled = !isEnabled;
      elements.showConfidenceLevel.disabled = !isEnabled;
      
      // Visual feedback
      if (!isEnabled) {
        document.querySelectorAll('.setting-item:not(:first-child)').forEach(item => {
          item.style.opacity = '0.5';
        });
      } else {
        document.querySelectorAll('.setting-item').forEach(item => {
          item.style.opacity = '1';
        });
      }
    });
  });
  
  // Listen for messages from other parts of the extension
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'authStatusChanged') {
      loadAuthStatus();
      sendResponse({ success: true });
    }
    
    return true; // Required for async response
  });