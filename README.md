# Meeting Minutes Generator

A complete solution for automatically generating and distributing meeting minutes using React frontend and n8n backend workflow.

## Project Structure

```
Email-Agent/
├── meeting-minutes-frontend/    # React frontend application
│   ├── src/
│   │   ├── App.jsx             # Main React component
│   │   ├── main.jsx            # React entry point
│   │   └── index.css           # Styling
│   ├── package.json            # Dependencies
│   ├── vite.config.js          # Vite configuration
│   └── index.html              # HTML template
└── n8n-workflow/
    └── meeting-minutes-workflow.json  # n8n workflow definition
```

## Features

### Frontend (React)
- 📁 File upload for .txt transcript files
- 📝 Manual text input for transcripts
- ✅ Form validation and error handling
- 🎨 Clean, responsive UI
- 📤 Sends transcript data to n8n webhook

### Backend (n8n Workflow)
- 🔗 Webhook endpoint to receive transcripts
- 📧 Email extraction using regex
- 🤖 AI-powered meeting minutes generation (OpenAI GPT-3.5)
- 📄 Google Docs creation
- 📬 Automated email distribution to participants

## Setup Instructions

### 1. React Frontend Setup

1. Navigate to the frontend directory:
   ```powershell
   cd "c:\Users\Meghana Nemani\Email-Agent\meeting-minutes-frontend"
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Update the webhook URL in `src/App.jsx`:
   ```javascript
   const WEBHOOK_URL = "https://your-actual-n8n-instance.com/webhook/meeting-minutes";
   ```

4. Start the development server:
   ```powershell
   npm run dev
   ```

5. Open your browser to `http://localhost:3000`

### 2. n8n Workflow Setup

#### Prerequisites
Ensure you have the following credentials configured in your n8n instance:
- **OpenAI API Key** (for GPT-3.5-turbo)
- **Google OAuth2** credentials (for Google Docs and Gmail)
- **Gmail API** access

#### Import Workflow
1. Open your n8n instance
2. Go to **Workflows** → **Import from File**
3. Upload `n8n-workflow/meeting-minutes-workflow.json`
4. Configure the required credentials:
   - OpenAI API connection
   - Google OAuth2 for Google Docs
   - Gmail credentials

#### Configure Credentials

**OpenAI:**
- Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
- Add as "OpenAI" credential in n8n

**Google Services:**
1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google Docs API and Gmail API
3. Create OAuth2 credentials
4. Add redirect URI: `https://your-n8n-instance.com/rest/oauth2-credential/callback`
5. Configure in n8n as "Google OAuth2 API" credential

#### Activate Workflow
1. Open the imported workflow
2. Click **Activate** to enable the webhook
3. Note the webhook URL (will be displayed in the Webhook node)
4. Update this URL in your React frontend

## Usage

1. **Upload or Paste Transcript:**
   - Upload a .txt file containing the meeting transcript, OR
   - Paste the transcript text directly into the textarea

2. **Submit:**
   - Click "Generate Meeting Minutes"
   - The system will process the transcript automatically

3. **Automated Process:**
   - Extracts email addresses from the transcript
   - Generates professional meeting minutes using AI
   - Creates a Google Doc with the minutes
   - Sends email to all detected participants with the summary and doc link

## Workflow Details

### Node Configuration

1. **Webhook Node**
   - Path: `/meeting-minutes`
   - Method: POST
   - Receives: `{ transcript: "meeting text..." }`

2. **Extract Emails (Code Node)**
   - Uses regex to find email addresses
   - Removes duplicates
   - Supports mixed-case matching

3. **OpenAI Node**
   - Model: gpt-3.5-turbo
   - Temperature: 0.3 (for consistent, professional output)
   - Max tokens: 1000
   - Generates structured meeting minutes

4. **Google Docs Node**
   - Creates document in specified folder
   - Title includes current date
   - Contains AI-generated content + metadata

5. **Gmail Node**
   - Sends to all extracted emails
   - HTML formatted email
   - Includes Google Doc link
   - Professional template

## Customization

### Frontend Modifications
- Update styling in `src/index.css`
- Modify form validation in `src/App.jsx`
- Add additional file formats support
- Implement progress indicators

### Workflow Modifications
- Change AI prompt in OpenAI node
- Modify email template in Gmail node
- Add additional processing steps
- Configure different folder destinations
- Add error handling nodes

## Troubleshooting

### Common Issues

**Frontend:**
- CORS errors: Ensure n8n webhook allows your domain
- File upload fails: Check file type validation
- Network errors: Verify webhook URL is correct

**n8n Workflow:**
- Webhook not triggering: Check if workflow is activated
- AI generation fails: Verify OpenAI API key and quota
- Google Docs creation fails: Check OAuth2 credentials and API permissions
- Email sending fails: Verify Gmail API access and sender authentication

### Testing

**Test the Workflow:**
1. Use a sample transcript with email addresses
2. Send a POST request to your webhook URL:
   ```javascript
   {
     "transcript": "Meeting with john@example.com and jane@company.com about project updates..."
   }
   ```
3. Check each node's output in n8n execution log

## Security Considerations

- Store API keys securely in n8n credentials
- Use HTTPS for webhook endpoints
- Validate file uploads on frontend
- Implement rate limiting if needed
- Review Google API permissions regularly

## License

This project is provided as-is for educational and business use.
