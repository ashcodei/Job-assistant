# JobsAI - AI-Powered Job Application Assistant

JobsAI is a comprehensive Chrome extension and web platform designed to streamline the job application process using AI technology. It helps users automatically fill out job applications by analyzing form fields and matching them with relevant information from the user's resume.

## Features

### Chrome Extension
- **Real-time Job Form Detection**: Automatically identifies job application forms on websites
- **AI-Powered Form Filling**: Analyzes form fields and suggests appropriate responses based on your resume
- **Confidence Indicators**:
  - ✅ Green: High confidence suggestions (auto-filled)
  - ⚠️ Yellow: Medium confidence suggestions (needs review)
  - ❌ Red: No relevant data found (requires manual input)
- **Interactive UI**:
  - Draggable floating bubble (similar to Grammarly)
  - Expandable side panel with AI suggestions
  - "Go-To" navigation to quickly jump to specific form fields
- **Learning Capability**: Improves suggestions based on your corrections

### Web Platform
- **Secure Authentication**:
  - Google OAuth 2.0 integration
  - Email & Password with JWT authentication
  - Email verification
- **User Profile Management**:
  - Personal information storage
  - Resume upload and analysis
- **Resume Analysis**:
  - Converts resume into structured data
  - Stores embeddings in vector database for efficient retrieval
  - Provides optimization suggestions
- **Application Tracking**:
  - History table with job details
  - Calendar visualization of application activity
- **AI Integration**:
  - Ollama for local AI processing
  - OpenAI compatibility (optional)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Ollama (for local AI processing)
- Chrome browser

### Backend Setup
1. Clone the repository:
```bash
git clone https://github.com/yourusername/JobsAI.git
cd JobsAI
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/jobsai
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
OLLAMA_API_URL=http://localhost:11434/api
```

4. Start the backend server:
```bash
npm start
```

### Web Platform Setup
1. Install frontend dependencies:
```bash
cd web-platform
npm install
```

2. Create a `.env` file in the web-platform directory:
```
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

3. Start the web application:
```bash
npm start
```

### Chrome Extension Setup
1. Build the extension:
```bash
cd chrome-extension
npm install
npm run build
```

2. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in the top-right corner)
   - Click "Load unpacked" and select the `chrome-extension/dist` directory

3. Configure the extension:
   - Click on the JobsAI extension icon
   - Sign in with your account credentials
   - Upload your resume if you haven't already done so on the web platform

## Usage

### Initial Setup
1. Create an account on the JobsAI web platform
2. Complete your profile information
3. Upload your resume (required for AI assistance)
4. Install the Chrome extension and sign in

### Using the Chrome Extension
1. Navigate to any job application page
2. The JobsAI bubble will appear when a job application form is detected
3. Click the bubble to open the side panel with AI-generated suggestions
4. Review and edit suggestions as needed
5. Use the "Go-To" buttons to navigate to specific form fields
6. Submit your application with confidence!

### Managing Your Applications
1. Visit the JobsAI web platform dashboard
2. View your application history and statistics
3. Check AI-generated resume insights for optimization

## Technologies Used
- **Frontend**: React.js, HTML5, CSS3
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with vector database capabilities
- **Authentication**: JWT, Google OAuth 2.0
- **AI Processing**: Ollama, OpenAI (optional)
- **Chrome Extension**: JavaScript, Chrome Extension API
