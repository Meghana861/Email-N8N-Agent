# Complete Implementation Guide: Meeting Minutes Generator

## Overview
Your frontend is ready and connects to `http://localhost:5678/webhook-test/meeting-minutes`. Now we need to set up the complete n8n workflow to make it functional.

## Current Architecture
```
Frontend (localhost:3000) 
    ↓ POST request
n8n Webhook (localhost:5678/webhook-test/meeting-minutes)
    ↓ Process transcript
    1. Extract emails from transcript
    2. Generate meeting minutes using OpenAI
    3. Create Google Doc
    4. Send emails to participants
```

## Implementation Steps

### Step 1: Install and Start n8n

1. **Install n8n globally:**
   ```bash
   npm install n8n -g
   ```

2. **Start n8n:**
   ```bash
   n8n start
   ```
   This will start n8n at `http://localhost:5678`

3. **Access n8n interface:**
   - Open browser to `http://localhost:5678`
   - Create your admin account

### Step 2: Import the Workflow

1. **Download the workflow file:**
   - Use the `meeting-minutes-workflow.json` from your `n8n-workflow` folder

2. **Import in n8n:**
   - Go to n8n interface
   - Click "Import from File"
   - Select `meeting-minutes-workflow.json`
   - Click "Import"

### Step 3: Configure API Credentials

#### A. OpenAI Setup
1. **Get OpenAI API Key:**
   - Go to https://platform.openai.com/api-keys
   - Create new API key
   - Copy the key

2. **Add to n8n:**
   - In n8n: Settings → Credentials
   - Click "Add Credential"
   - Select "OpenAI"
   - Paste your API key
   - Test connection

#### B. Google Services Setup
1. **Google Cloud Console:**
   - Go to https://console.cloud.google.com/
   - Create new project or select existing
   - Enable APIs: Google Docs API, Gmail API, Google Drive API

2. **Create OAuth2 Credentials:**
   - Go to APIs & Services → Credentials
   - Create OAuth 2.0 Client ID
   - Add redirect URI: `http://localhost:5678/rest/oauth2-credential/callback`
   - Download credentials JSON

3. **Configure in n8n:**
   - Settings → Credentials
   - Add "Google OAuth2 API"
   - Enter Client ID and Secret from Google Console
   - Complete OAuth flow

### Step 4: Configure Workflow Nodes

#### Webhook Node:
- Path: `webhook-test/meeting-minutes`
- Method: POST
- No additional config needed

#### Extract Emails Node (Code):
- Already configured with email extraction logic

#### OpenAI Node:
- Select your OpenAI credential
- Model: gpt-3.5-turbo
- Temperature: 0.3

#### Google Docs Node:
- Select Google OAuth2 credential
- Set folder ID for your Google Drive folder

#### Gmail Node:
- Select Google OAuth2 credential
- Configure email template

### Step 5: Test the Complete Flow

#### Frontend Test:
1. **Start your frontend:**
   ```bash
   cd meeting-minutes-frontend
   npm run dev
   ```

2. **Start n8n:**
   ```bash
   n8n start
   ```

3. **Test with sample transcript:**
   - Use the provided `sample-transcript.txt`
   - Upload via frontend
   - Check n8n execution logs

#### Manual Test:
```bash
curl -X POST http://localhost:5678/webhook-test/meeting-minutes \
  -H "Content-Type: application/json" \
  -d '{"transcript": "Meeting with john@example.com and jane@example.com about Q4 planning. Action items: John to review budget by Friday, Jane to prepare presentation for next week."}'
```

### Step 6: Workflow Activation

1. **Activate the workflow:**
   - In n8n, toggle "Active" for your workflow
   - Webhook will now accept requests

2. **Monitor executions:**
   - Check "Executions" tab for logs
   - Debug any errors

## Expected Flow

1. **User uploads transcript** via frontend
2. **Frontend sends POST** to n8n webhook
3. **n8n processes** the transcript:
   - Extracts participant emails
   - Generates structured meeting minutes using AI
   - Creates Google Doc with the minutes
   - Sends email to all participants with document link

## Troubleshooting

### Common Issues:

**Frontend Connection Error:**
- Ensure n8n is running on port 5678
- Check webhook URL: `http://localhost:5678/webhook-test/meeting-minutes`
- Verify workflow is activated

**OpenAI Errors:**
- Check API key validity
- Verify account has credits
- Check rate limits

**Google API Errors:**
- Refresh OAuth tokens
- Check API quotas
- Verify permissions

**Email Delivery Issues:**
- Test with fewer recipients
- Check Gmail API limits
- Verify sender authentication

## Next Steps

1. **Customize the AI prompt** in OpenAI node for your specific needs
2. **Modify email template** in Gmail node
3. **Add error handling** and notifications
4. **Set up production deployment** when ready

## Production Considerations

- Use environment variables for sensitive data
- Implement proper error handling
- Set up monitoring and logging
- Consider scaling for multiple users
- Add webhook authentication for security

Your setup is now ready for testing! Start both services and try uploading a meeting transcript through your frontend.
