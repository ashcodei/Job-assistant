/**
 * JobsAI Popup Script
 */

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize UI
    showLoadingState();
    
    // Check authentication status
    await checkAuthStatus();
    
    // Add event listeners
    setupEventListeners();
  });
  
  // Show login state
  const showLoginState = () => {
    document.getElementById('login-state').style.display = 'flex';
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('logged-in-state').style.display = 'none';
  };
  
  // Show loading state
  const showLoadingState = () => {
    document.getElementById('login-state').style.display = 'none';
    document.getElementById('loading-state').style.display = 'flex';
    document.getElementById('logged-in-state').style.display = 'none';
  };
  
  // Show logged in state
  const showLoggedInState = (user) => {
    document.getElementById('login-state').style.display = 'none';
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('logged-in-state').style.display = 'flex';
    
    // Update user info
    if (user) {
      document.getElementById('user-name').textContent = user.name || 'User';
      document.getElementById('user-email').textContent = user.email || '';
      
      // Set avatar
      if (user.name) {
        document.getElementById('user-avatar').textContent = user.name.charAt(0);
      }
      
      // Update resume status
      updateResumeStatus(user.hasResume);
    }
  };
  
  // Update resume status UI
  const updateResumeStatus = (hasResume) => {
    const resumeStatus = document.getElementById('resume-status');
    
    if (hasResume) {
      resumeStatus.innerHTML = `
        <div class="feature-icon success">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="feature-text">
          <h4>Resume Data</h4>
          <p>Resume uploaded and processed</p>
        </div>
      `;
    } else {
      resumeStatus.innerHTML = `
        <div class="feature-icon warning">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5.33333V8M8 10.6667H8.00667M14.6667 8C14.6667 11.6819 11.6819 14.6667 8 14.6667C4.3181 14.6667 1.33333 11.6819 1.33333 8C1.33333 4.3181 4.3181 1.33333 8 1.33333C11.6819 1.33333 14.6667 4.3181 14.6667 8Z" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="feature-text">
          <h4>Resume Data</h4>
          <p>Resume needed for full functionality</p>
        </div>
      `;
    }
  };
  
  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      const data = await chrome.storage.local.get(['isAuthenticated', 'userProfile', 'authToken']);
      
      if (data.isAuthenticated && data.userProfile && data.authToken) {
        // Validate token with the server
        const validToken = await validateToken(data.authToken);
        
        if (validToken) {
          showLoggedInState(data.userProfile);
          return;
        } else {
          // Token is invalid, clear auth data
          await chrome.storage.local.remove(['isAuthenticated', 'userProfile', 'authToken']);
        }
      }
      
      showLoginState();
    } catch (error) {
      console.error('Error checking auth status:', error);
      showLoginState();
    }
  };
  
  // Validate token with the server
  const validateToken = async (token) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/validate', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  };
  
  // Setup event listeners
  const setupEventListeners = () => {
    // Google login button
    document.getElementById('google-login-btn').addEventListener('click', () => {
      initiateGoogleAuth();
    });
    
    // Web login button
    document.getElementById('web-login-btn').addEventListener('click', () => {
      chrome.tabs.create({ url: 'http://localhost:3000/login' });
    });
    
    // Dashboard button
    document.getElementById('dashboard-btn').addEventListener('click', () => {
      chrome.tabs.create({ url: 'http://localhost:3000/dashboard' });
    });
    
    // Logout button
    document.getElementById('logout-btn').addEventListener('click', async () => {
      await handleLogout();
    });
  };
  
  // Initiate Google OAuth flow
  const initiateGoogleAuth = () => {
    chrome.runtime.sendMessage({ action: 'initiateGoogleAuth' }, (response) => {
      if (response.error) {
        console.error('Google auth error:', response.error);
      }
    });
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      showLoadingState();
      
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
      
      // Notify content script
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'authStatusChanged' });
        }
      });
      
      showLoginState();
    } catch (error) {
      console.error('Error during logout:', error);
      showLoginState();
    }
  };
  
  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'authStatusChanged') {
      checkAuthStatus();
      sendResponse({ success: true });
    }
    
    return true; // Required for async response
  });