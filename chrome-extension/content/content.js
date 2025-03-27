/**
 * JobsAI Content Script
 * Handles form detection, floating bubble, and sidebar UI
 */

// Global variables
let isAuthenticated = false;
let userProfile = null;
let formFieldsData = [];
let sidebarOpen = false;
let bubblePosition = { x: 20, y: 100 };

// Load user authentication status
const loadAuthStatus = async () => {
  try {
    const data = await chrome.storage.local.get(['isAuthenticated', 'userProfile']);
    isAuthenticated = data.isAuthenticated || false;
    userProfile = data.userProfile || null;
    
    if (isAuthenticated) {
      detectJobApplicationForm();
    }
  } catch (error) {
    console.error('Error loading auth status:', error);
  }
};

// Detect if current page is a job application form
const detectJobApplicationForm = () => {
  // Score the page to determine if it's likely a job application form
  const formScore = calculateFormScore();
  
  if (formScore > 60) {
    console.log('Job application form detected!');
    analyzeFormFields();
    createFloatingBubble();
  }
};

// Calculate a score to determine if the page is a job application form
const calculateFormScore = () => {
  let score = 0;
  
  // Check for forms
  const forms = document.querySelectorAll('form');
  if (forms.length > 0) score += 20;
  
  // Check for common job application keywords in URL or page content
  const pageContent = document.body.innerText.toLowerCase();
  const url = window.location.href.toLowerCase();
  
  const jobKeywords = [
    'application', 'apply', 'job', 'career', 'employment', 'resume',
    'cv', 'work history', 'experience', 'education', 'skills'
  ];
  
  jobKeywords.forEach(keyword => {
    if (url.includes(keyword)) score += 5;
    if (pageContent.includes(keyword)) score += 2;
  });
  
  // Check for specific input types common in job applications
  const inputTypes = {
    'name': ['name', 'full name', 'first name', 'last name'],
    'email': ['email', 'e-mail'],
    'phone': ['phone', 'telephone', 'mobile'],
    'education': ['education', 'degree', 'university', 'college', 'school'],
    'experience': ['experience', 'work history', 'employment']
  };
  
  let foundInputTypes = 0;
  
  Object.values(inputTypes).forEach(typeKeywords => {
    const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
    
    typeKeywords.forEach(keyword => {
      inputs.some(input => {
        const labelText = getInputLabel(input)?.toLowerCase() || '';
        const placeholderText = input.placeholder?.toLowerCase() || '';
        const idText = input.id?.toLowerCase() || '';
        const nameText = input.name?.toLowerCase() || '';
        
        if (labelText.includes(keyword) || 
            placeholderText.includes(keyword) || 
            idText.includes(keyword) || 
            nameText.includes(keyword)) {
          foundInputTypes++;
          return true;
        }
        return false;
      });
    });
  });
  
  score += foundInputTypes * 5;
  
  return score;
};

// Get the label for an input element
const getInputLabel = (input) => {
  // Check for label with 'for' attribute
  if (input.id) {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (label) return label.textContent;
  }
  
  // Check for wrapped label
  const parent = input.parentElement;
  if (parent && parent.tagName === 'LABEL') {
    return parent.textContent;
  }
  
  // Check for label in previous sibling
  let sibling = input.previousElementSibling;
  if (sibling && sibling.tagName === 'LABEL') {
    return sibling.textContent;
  }
  
  return null;
};

// Analyze form fields to extract relevant information
const analyzeFormFields = async () => {
  // Get all input fields, textareas, and selects
  const formElements = Array.from(document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea, select'));
  
  // Initial analysis of form fields
  formFieldsData = formElements.map((element, index) => {
    // Get field label and other identifying information
    const label = getInputLabel(element)?.trim() || '';
    const placeholder = element.placeholder || '';
    const id = element.id || '';
    const name = element.name || '';
    const type = element.type || element.tagName.toLowerCase();
    
    return {
      id: index,
      element: element,
      elementId: id,
      elementName: name,
      fieldType: type,
      label: label,
      placeholder: placeholder,
      fieldName: label || placeholder || name || id,
      value: element.value || '',
      aiSuggestion: '',
      confidenceLevel: 'red', // Default: no data
      requiredField: element.required
    };
  }).filter(field => field.fieldName); // Filter out fields with no identifiable name
  
  if (formFieldsData.length > 0 && isAuthenticated) {
    requestAISuggestions();
  }
};

// Request AI suggestions from backend for form fields
const requestAISuggestions = async () => {
  try {
    // Prepare form data to send to backend
    const formData = {
      url: window.location.href,
      title: document.title,
      fields: formFieldsData.map(field => ({
        fieldId: field.id,
        fieldName: field.fieldName,
        fieldType: field.fieldType,
        label: field.label,
        placeholder: field.placeholder,
        required: field.requiredField
      }))
    };
    
    // Get user token
    const tokenData = await chrome.storage.local.get(['authToken']);
    const token = tokenData.authToken;
    
    if (!token) {
      throw new Error('Authentication token not found');
    }
    
    // Send request to backend
    const response = await fetch('http://localhost:3000/api/suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to get AI suggestions');
    }
    
    const suggestions = await response.json();
    
    // Update form fields data with AI suggestions
    formFieldsData = formFieldsData.map(field => {
      const suggestion = suggestions.fields.find(s => s.fieldId === field.id);
      
      if (suggestion) {
        return {
          ...field,
          aiSuggestion: suggestion.value || '',
          confidenceLevel: suggestion.confidence || 'red'
        };
      }
      
      return field;
    });
    
    // Update sidebar if it's open
    if (sidebarOpen) {
      updateSidebarContent();
    }
    
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
  }
};

// Create the floating bubble UI
const createFloatingBubble = () => {
  // Check if bubble already exists
  if (document.getElementById('jobsai-bubble')) {
    return;
  }
  
  // Load bubble template from sidebar.html
  const bubbleURL = chrome.runtime.getURL('sidebar/sidebar.html');
  
  fetch(bubbleURL)
    .then(response => response.text())
    .then(html => {
      // Create temporary container to parse HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Get bubble template
      const bubbleTemplate = doc.getElementById('jobsai-bubble-template');
      
      if (bubbleTemplate) {
        // Create bubble container
        const bubble = bubbleTemplate.querySelector('.jobsai-bubble').cloneNode(true);
        bubble.id = 'jobsai-bubble';
        
        // Load settings from storage
        chrome.storage.sync.get('settings', (result) => {
          const settings = result.settings || {};
          
          // Get default position based on settings or use stored position
          chrome.storage.local.get(['bubblePosition'], (posResult) => {
            const defaultPosition = getBubbleDefaultPosition(settings.bubblePosition || 'bottom-left');
            const position = posResult.bubblePosition || defaultPosition;
            
            bubble.style.left = `${position.x}px`;
            bubble.style.top = `${position.y}px`;
            
            // Add event listeners for bubble
            bubble.addEventListener('click', toggleSidebar);
            
            // Make bubble draggable
            makeDraggable(bubble);
            
            // Add bubble to page
            document.body.appendChild(bubble);
          });
        });
      }
    })
    .catch(error => {
      console.error('Error loading sidebar template:', error);
      // Fallback to direct HTML creation (original implementation)
      const bubble = document.createElement('div');
      bubble.id = 'jobsai-bubble';
      bubble.classList.add('jobsai-bubble');
      
      // Set position from stored preference or default
      chrome.storage.local.get(['bubblePosition'], (result) => {
        const position = result.bubblePosition || bubblePosition;
        bubble.style.left = `${position.x}px`;
        bubble.style.top = `${position.y}px`;
      });
      
      // Add bubble content/icon
      bubble.innerHTML = `
        <div class="jobsai-bubble-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FFF" />
          </svg>
        </div>
        <div class="jobsai-bubble-tooltip">JobsAI Assistant</div>
      `;
      
      // Add event listeners for bubble
      bubble.addEventListener('click', toggleSidebar);
      
      // Make bubble draggable
      makeDraggable(bubble);
      
      // Add bubble to page
      document.body.appendChild(bubble);
    });
};

// Helper function to get default bubble position based on setting
const getBubbleDefaultPosition = (position) => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  switch(position) {
    case 'top-left':
      return { x: 20, y: 20 };
    case 'top-right':
      return { x: windowWidth - 70, y: 20 };
    case 'bottom-right':
      return { x: windowWidth - 70, y: windowHeight - 70 };
    case 'bottom-left':
    default:
      return { x: 20, y: windowHeight - 70 };
  }
};

// Make an element draggable
const makeDraggable = (element) => {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  
  element.onmousedown = dragMouseDown;
  
  function dragMouseDown(e) {
    e.preventDefault();
    // Get mouse position at startup
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
    
    // Add active class while dragging
    element.classList.add('dragging');
  }
  
  function elementDrag(e) {
    e.preventDefault();
    // Calculate new position
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    
    // Set element's new position
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
  }
  
  function closeDragElement() {
    // Stop moving when mouse button is released
    document.onmouseup = null;
    document.onmousemove = null;
    element.classList.remove('dragging');
    
    // Save position
    const newPosition = {
      x: parseInt(element.style.left),
      y: parseInt(element.style.top)
    };
    
    chrome.storage.local.set({ 'bubblePosition': newPosition });
  }
};

// Toggle sidebar visibility
const toggleSidebar = () => {
  // Check if sidebar exists
  let sidebar = document.getElementById('jobsai-sidebar');
  
  if (!sidebar) {
    // Get sidebar width from settings
    chrome.storage.sync.get('settings', (result) => {
      const settings = result.settings || {};
      const sidebarWidth = settings.sidebarWidth || 320;
      
      // Load sidebar template from sidebar.html
      const sidebarURL = chrome.runtime.getURL('sidebar/sidebar.html');
      
      fetch(sidebarURL)
        .then(response => response.text())
        .then(html => {
          // Create temporary container to parse HTML
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          
          // Get sidebar template
          const sidebarTemplate = doc.getElementById('jobsai-sidebar-template');
          
          if (sidebarTemplate) {
            // Create sidebar container
            const sidebar = sidebarTemplate.querySelector('.jobsai-sidebar').cloneNode(true);
            sidebar.id = 'jobsai-sidebar';
            
            // Set custom width if specified in settings
            sidebar.style.width = `${sidebarWidth}px`;
            
            // Add sidebar to page
            document.body.appendChild(sidebar);
            
            // Add event listeners
            document.getElementById('jobsai-sidebar-close').addEventListener('click', toggleSidebar);
            
            // Show sidebar with animation
            setTimeout(() => {
              sidebar.classList.add('open');
            }, 10);
            
            sidebarOpen = true;
            
            // Update content
            updateSidebarContent();
          }
        })
        .catch(error => {
          console.error('Error loading sidebar template:', error);
          // Fallback to direct HTML creation (original implementation)
          createFallbackSidebar();
        });
    });
  } else {
    // Toggle sidebar visibility
    if (sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
      setTimeout(() => {
        sidebar.remove();
        sidebarOpen = false;
      }, 300); // Wait for animation to complete
    } else {
      sidebar.classList.add('open');
      sidebarOpen = true;
      updateSidebarContent();
    }
  }
};

// Create fallback sidebar if template loading fails
const createFallbackSidebar = () => {
  const sidebar = document.createElement('div');
  sidebar.id = 'jobsai-sidebar';
  sidebar.classList.add('jobsai-sidebar');
  
  // Create sidebar content
  sidebar.innerHTML = `
    <div class="jobsai-sidebar-header">
      <div class="jobsai-sidebar-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#4F46E5" />
        </svg>
        <h2>JobsAI Assistant</h2>
      </div>
      <button id="jobsai-sidebar-close" class="jobsai-sidebar-close-btn">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 3.5L3.5 12.5M3.5 3.5L12.5 12.5" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    <div class="jobsai-sidebar-content">
      <div class="jobsai-loading">
        <div class="jobsai-spinner"></div>
        <p>Analyzing form fields...</p>
      </div>
    </div>
  `;
  
  // Add sidebar to page
  document.body.appendChild(sidebar);
  
  // Add event listeners
  document.getElementById('jobsai-sidebar-close').addEventListener('click', toggleSidebar);
  
  // Show sidebar with animation
  setTimeout(() => {
    sidebar.classList.add('open');
  }, 10);
  
  sidebarOpen = true;
  
  // Update content
  updateSidebarContent();
};

// Update sidebar content with form fields and AI suggestions
const updateSidebarContent = () => {
  const sidebar = document.getElementById('jobsai-sidebar');
  if (!sidebar) return;
  
  const contentContainer = sidebar.querySelector('.jobsai-sidebar-content');
  
  if (formFieldsData.length === 0) {
    contentContainer.innerHTML = `
      <div class="jobsai-message">
        <p>No form fields detected on this page.</p>
      </div>
    `;
    return;
  }
  
  // Check if we're logged in
  if (!isAuthenticated) {
    contentContainer.innerHTML = `
      <div class="jobsai-message">
        <p>Please sign in to use JobsAI Assistant</p>
        <button id="jobsai-login-btn" class="jobsai-btn">Sign In</button>
      </div>
    `;
    
    document.getElementById('jobsai-login-btn').addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'openLogin' });
    });
    
    return;
  }
  
  // Generate field suggestions list
  let fieldsHTML = '';
  
  formFieldsData.forEach(field => {
    // Determine confidence indicator
    let confidenceIcon = '';
    
    switch (field.confidenceLevel) {
      case 'green':
        confidenceIcon = '<span class="confidence-indicator high">✓</span>';
        break;
      case 'yellow':
        confidenceIcon = '<span class="confidence-indicator medium">⚠️</span>';
        break;
      case 'red':
      default:
        confidenceIcon = '<span class="confidence-indicator low">✗</span>';
        break;
    }
    
    fieldsHTML += `
      <div class="jobsai-field-item" data-field-id="${field.id}">
        <div class="jobsai-field-header">
          <div class="jobsai-field-title">
            ${confidenceIcon}
            <h3>${field.fieldName}</h3>
            ${field.requiredField ? '<span class="required-badge">Required</span>' : ''}
          </div>
          <div class="jobsai-field-actions">
            <button class="jobsai-goto-btn" data-field-id="${field.id}">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2V14M8 2L4 6M8 2L12 6" stroke="#4F46E5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="jobsai-field-content">
          <div class="jobsai-suggestion-input">
            <textarea class="jobsai-suggestion-textarea" data-field-id="${field.id}">${field.aiSuggestion || ''}</textarea>
            <div class="jobsai-suggestion-actions">
              <button class="jobsai-apply-btn" data-field-id="${field.id}">Apply</button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  
  // Statistics summary
  const greenCount = formFieldsData.filter(f => f.confidenceLevel === 'green').length;
  const yellowCount = formFieldsData.filter(f => f.confidenceLevel === 'yellow').length;
  const redCount = formFieldsData.filter(f => f.confidenceLevel === 'red').length;
  
  const statsHTML = `
    <div class="jobsai-stats">
      <div class="jobsai-stats-item green">
        <span class="jobsai-stats-count">${greenCount}</span>
        <span class="jobsai-stats-label">Auto-filled</span>
      </div>
      <div class="jobsai-stats-item yellow">
        <span class="jobsai-stats-count">${yellowCount}</span>
        <span class="jobsai-stats-label">Needs review</span>
      </div>
      <div class="jobsai-stats-item red">
        <span class="jobsai-stats-count">${redCount}</span>
        <span class="jobsai-stats-label">Manual input</span>
      </div>
    </div>
  `;
  
  // Complete sidebar content
  contentContainer.innerHTML = `
    <div class="jobsai-user-info">
      <div class="jobsai-user-avatar">
        ${userProfile?.name?.charAt(0) || 'U'}
      </div>
      <div class="jobsai-user-details">
        <p class="jobsai-user-name">${userProfile?.name || 'User'}</p>
        <p class="jobsai-user-email">${userProfile?.email || ''}</p>
      </div>
    </div>
    
    ${statsHTML}
    
    <div class="jobsai-field-list">
      ${fieldsHTML}
    </div>
    
    <div class="jobsai-footer">
      <button id="jobsai-apply-all-btn" class="jobsai-btn jobsai-btn-primary">Apply All</button>
    </div>
  `;
  
  // Add event listeners
  document.querySelectorAll('.jobsai-goto-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const fieldId = parseInt(e.currentTarget.dataset.fieldId);
      scrollToField(fieldId);
    });
  });
  
  document.querySelectorAll('.jobsai-apply-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const fieldId = parseInt(e.currentTarget.dataset.fieldId);
      applyFieldSuggestion(fieldId);
    });
  });
  
  document.querySelectorAll('.jobsai-suggestion-textarea').forEach(textarea => {
    textarea.addEventListener('input', (e) => {
      const fieldId = parseInt(e.target.dataset.fieldId);
      updateSuggestion(fieldId, e.target.value);
    });
  });
  
  document.getElementById('jobsai-apply-all-btn').addEventListener('click', applyAllSuggestions);
};

// Scroll to a specific form field
const scrollToField = (fieldId) => {
  const field = formFieldsData.find(f => f.id === fieldId);
  
  if (field && field.element) {
    field.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Highlight the element temporarily
    field.element.classList.add('jobsai-highlight');
    setTimeout(() => {
      field.element.classList.remove('jobsai-highlight');
    }, 2000);
    
    // Focus the element
    field.element.focus();
  }
};

// Apply a suggestion to a field
const applyFieldSuggestion = (fieldId) => {
  const field = formFieldsData.find(f => f.id === fieldId);
  
  if (field && field.element) {
    // Update the field value
    field.element.value = field.aiSuggestion;
    
    // Trigger input event for frameworks to detect changes
    const event = new Event('input', { bubbles: true });
    field.element.dispatchEvent(event);
    
    // Also trigger change event
    const changeEvent = new Event('change', { bubbles: true });
    field.element.dispatchEvent(changeEvent);
    
    // Visual feedback
    field.element.classList.add('jobsai-applied');
    setTimeout(() => {
      field.element.classList.remove('jobsai-applied');
    }, 2000);
  }
};

// Update a suggestion value
const updateSuggestion = (fieldId, value) => {
  const fieldIndex = formFieldsData.findIndex(f => f.id === fieldId);
  
  if (fieldIndex !== -1) {
    formFieldsData[fieldIndex].aiSuggestion = value;
    
    // Send feedback to backend to improve AI suggestions
    sendFeedback(fieldId, value);
  }
};

// Apply all suggestions to form fields
const applyAllSuggestions = () => {
  formFieldsData.forEach(field => {
    if (field.aiSuggestion) {
      // Update the field value
      field.element.value = field.aiSuggestion;
      
      // Trigger input event
      const event = new Event('input', { bubbles: true });
      field.element.dispatchEvent(event);
      
      // Also trigger change event
      const changeEvent = new Event('change', { bubbles: true });
      field.element.dispatchEvent(changeEvent);
    }
  });
  
  // Show success message
  const sidebar = document.getElementById('jobsai-sidebar');
  if (sidebar) {
    const successMsg = document.createElement('div');
    successMsg.classList.add('jobsai-success-message');
    successMsg.textContent = 'All fields applied successfully!';
    
    sidebar.appendChild(successMsg);
    
    setTimeout(() => {
      successMsg.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      successMsg.classList.remove('show');
      setTimeout(() => {
        successMsg.remove();
      }, 300);
    }, 3000);
  }
};

// Send feedback to backend to improve AI suggestions
const sendFeedback = async (fieldId, userValue) => {
  try {
    const field = formFieldsData.find(f => f.id === fieldId);
    
    if (!field) return;
    
    // Get user token
    const tokenData = await chrome.storage.local.get(['authToken']);
    const token = tokenData.authToken;
    
    if (!token) {
      throw new Error('Authentication token not found');
    }
    
    // Send feedback to backend
    const response = await fetch('http://localhost:3000/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        url: window.location.href,
        fieldId: fieldId,
        fieldName: field.fieldName,
        originalSuggestion: field.aiSuggestion,
        userCorrection: userValue
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to send feedback');
    }
    
  } catch (error) {
    console.error('Error sending feedback:', error);
  }
};

// Listen for messages from popup or background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'authStatusChanged':
      loadAuthStatus();
      sendResponse({ success: true });
      break;
      
    case 'settingsUpdated':
      // Apply updated settings
      applySettings(message.settings);
      sendResponse({ success: true });
      break;
  }
  
  return true; // Indicate async response
});

// Apply settings to the extension UI and functionality
const applySettings = (settings) => {
  // Check if extension is enabled
  if (settings && settings.hasOwnProperty('enableExtension') && !settings.enableExtension) {
    // If extension is disabled, remove UI elements
    const bubble = document.getElementById('jobsai-bubble');
    if (bubble) bubble.remove();
    
    const sidebar = document.getElementById('jobsai-sidebar');
    if (sidebar) sidebar.remove();
    
    // Reset state
    sidebarOpen = false;
    
    return; // Don't proceed with other settings if disabled
  }
  
  // Apply sidebar width if sidebar is open
  if (settings && settings.hasOwnProperty('sidebarWidth')) {
    const sidebar = document.getElementById('jobsai-sidebar');
    if (sidebar) {
      sidebar.style.width = `${settings.sidebarWidth}px`;
    }
  }
  
  // Apply bubble visibility setting
  if (settings && settings.hasOwnProperty('showBubble')) {
    const bubble = document.getElementById('jobsai-bubble');
    
    if (settings.showBubble && !bubble && isAuthenticated) {
      // Show bubble if it doesn't exist
      createFloatingBubble();
    } else if (!settings.showBubble && bubble) {
      // Hide bubble if it exists
      bubble.remove();
    }
  }
  
  // Other settings will be applied during normal operation
  // e.g., confidence threshold, auto-fill settings, etc.
};

// Initialize content script
document.addEventListener('DOMContentLoaded', () => {
  loadAuthStatus();
});

// Also run on initial load in case DOMContentLoaded already fired
loadAuthStatus();