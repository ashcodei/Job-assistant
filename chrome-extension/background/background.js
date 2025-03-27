/**
 * JobsAI Background Script
 * Handles authentication, messaging, and background tasks
 */

// Track auth state
let isAuthenticated = false;

// Check initial auth state
chrome.storage.local.get(['isAuthenticated'], (data) => {
  isAuthenticated = data.isAuthenticated || false;
});

// Listen for messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle different message actions
  switch (message.action) {
    case 'initiateGoogleAuth':
      handleGoogleAuth(sendResponse);
      return true; // Required for async response
      
    case 'openLogin':
      openLoginPage();
      sendResponse({ success: true });
      break;
      
    case 'checkAuthStatus':
      sendResponse({ isAuthenticated });
      break;
      
    case 'logWebAuth':
      handleWebAuthentication(message.token, sendResponse);
      return true; // Required for async response
      
    case 'settingsUpdated':
      // Broadcast settings update to all tabs
      broadcastSettingsUpdate(message.settings);
      sendResponse({ success: true });
      break;
      
    case 'openOptions':
      chrome.runtime.openOptionsPage();
      sendResponse({ success: true });
      break;
  }
});

// Handle Google OAuth authentication
const handleGoogleAuth = async (sendResponse) => {
  try {
    // Launch Google OAuth flow
    const authOptions = {
      'interactive': true,
      'scopes': [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
      ]
    };
    
    const authToken = await chrome.identity.getAuthToken(authOptions);
    
    if (!authToken) {
      sendResponse({ error: 'Failed to get auth token' });
      return;
    }
    
    // Get user info from Google
    const userInfoResponse = await fetch(
      'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
      {
        headers: {
          'Authorization': `Bearer ${authToken.token}`
        }
      }
    );
    
    if (!userInfoResponse.ok) {
      sendResponse({ error: 'Failed to get user info' });
      return;
    }
    
    const userInfo = await userInfoResponse.json();
    
    // Send the token to our backend for validation and JWT creation
    const backendResponse = await fetch('http://localhost:3000/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        googleToken: authToken.token,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture
      })
    });
    
    if (!backendResponse.ok) {
      sendResponse({ error: 'Backend authentication failed' });
      return;
    }
    
    const backendData = await backendResponse.json();
    
    // Save auth data to storage
    await chrome.storage.local.set({
      'isAuthenticated': true,
      'authToken': backendData.token,
      'userProfile': {
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        hasResume: backendData.hasResume || false
      }
    });
    
    isAuthenticated = true;
    
    // Notify other parts of the extension
    notifyAuthStatusChanged();
    
    sendResponse({ success: true });
  } catch (error) {
    console.error('Google auth error:', error);
    sendResponse({ error: error.message });
  }
};

// Handle web-based authentication (when user logs in on the website)
const handleWebAuthentication = async (token, sendResponse) => {
  try {
    if (!token) {
      sendResponse({ error: 'Invalid token' });
      return;
    }
    
    // Validate token with backend
    const validationResponse = await fetch('http://localhost:3000/api/auth/validate', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!validationResponse.ok) {
      sendResponse({ error: 'Invalid token' });
      return;
    }
    
    const userData = await validationResponse.json();
    
    // Save auth data to storage
    await chrome.storage.local.set({
      'isAuthenticated': true,
      'authToken': token,
      'userProfile': {
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        hasResume: userData.hasResume || false
      }
    });
    
    isAuthenticated = true;
    
    // Notify other parts of the extension
    notifyAuthStatusChanged();
    
    sendResponse({ success: true });
  } catch (error) {
    console.error('Web auth error:', error);
    sendResponse({ error: error.message });
  }
};

// Open login page
const openLoginPage = () => {
  chrome.tabs.create({ url: 'http://localhost:3000/login' });
};

// Notify all parts of the extension about auth status change
const notifyAuthStatusChanged = () => {
  // Notify popup if open
  chrome.runtime.sendMessage({ action: 'authStatusChanged' });
  
  // Notify content scripts in all tabs
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      chrome.tabs.sendMessage(tab.id, { action: 'authStatusChanged' })
        .catch(() => {
          // Suppress errors for tabs where content script is not running
        });
    }
  });
};

// Broadcast settings update to all tabs
const broadcastSettingsUpdate = (settings) => {
  // Notify popup if open
  chrome.runtime.sendMessage({ action: 'settingsUpdated', settings });
  
  // Notify content scripts in all tabs
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      chrome.tabs.sendMessage(tab.id, { action: 'settingsUpdated', settings })
        .catch(() => {
          // Suppress errors for tabs where content script is not running
        });
    }
  });
};

// Listen for web auth messages from the website
chrome.runtime.onMessageExternal.addListener(async (message, sender, sendResponse) => {
  // Only accept messages from our website
  if (sender.url.startsWith('http://localhost:3000')) {
    if (message.action === 'webAuth' && message.token) {
      await handleWebAuthentication(message.token, sendResponse);
    }
  }
  
  return true; // Required for async response
});

// Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Open onboarding page
    chrome.tabs.create({ url: 'http://localhost:3000/onboarding' });
  }
});