# n8n Workflow Configuration Guide

## Complete Setup Instructions for Meeting Minutes Generator Workflow

### 1. Prerequisites

Before importing the workflow, ensure you have:
- An active n8n instance (cloud or self-hosted)
- OpenAI API account with credits
- Google Cloud Platform account
- Gmail account for sending emails

### 2. API Credentials Setup

#### OpenAI Configuration
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. In n8n:
   - Go to **Settings** → **Credentials**
   - Click **Add Credential**
   - Select **OpenAI**
   - Enter your API key
   - Test the connection

#### Google Services Configuration

**Step 1: Google Cloud Console Setup**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Google Docs API
   - Gmail API
   - Google Drive API

**Step 2: OAuth2 Credentials**
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client IDs**
3. Configure consent screen if needed
4. Set application type to **Web application**
5. Add authorized redirect URIs:
   ```
   https://your-n8n-instance.com/rest/oauth2-credential/callback
   ```
6. Download the client configuration JSON

**Step 3: n8n Google OAuth2 Setup**
1. In n8n, go to **Settings** → **Credentials**
2. Click **Add Credential** → **Google OAuth2 API**
3. Enter:
   - Client ID (from Google Console)
   - Client Secret (from Google Console)
4. Click **Connect my account**
5. Complete OAuth flow
6. Grant permissions for:
   - Google Docs
   - Gmail
   - Google Drive

### 3. Workflow Import and Configuration

#### Import the Workflow
1. Download the `meeting-minutes-workflow.json` file
2. In n8n:
   - Go to **Workflows**
   - Click **Import from File**
   - Select the JSON file
   - Click **Import**

#### Configure Each Node

**Webhook Node:**
- No additional configuration needed
- Note the webhook URL for frontend integration

**Extract Emails (Code Node):**
- Pre-configured with email extraction logic
- No changes needed

**OpenAI Node:**
- Select your OpenAI credential
- Model: `gpt-3.5-turbo` (default)
- Temperature: `0.3` for consistent output
- Max Tokens: `1000`

**Google Docs Node:**
- Select your Google OAuth2 credential
- Update `folderId` to your desired Google Drive folder:
  ```
  1DfMlL2xRK6YrrS_AJE94CujIVZ476Wko
  ```
- To find your folder ID:
  1. Open Google Drive
  2. Navigate to desired folder
  3. Copy ID from URL: `drive.google.com/drive/folders/[FOLDER_ID]`

**Gmail Node:**
- Select your Google OAuth2 credential
- Email template is pre-configured
- Modify subject/content as needed

### 4. Testing the Workflow

#### Manual Test
1. Click **Execute Workflow** button
2. In the Webhook node, click **Listen for calls**
3. Send a test POST request:
   ```bash
   curl -X POST https://your-n8n-instance.com/webhook/meeting-minutes \
   -H "Content-Type: application/json" \
   -d '{"transcript": "Meeting with john@test.com and jane@test.com about project updates"}'
   ```

#### Frontend Integration Test
1. Update the webhook URL in your React app
2. Upload the provided sample transcript
3. Check n8n execution log for any errors

### 5. Workflow Activation

1. Click **Activate** toggle in the workflow
2. Webhook will now accept real requests
3. Monitor executions in the **Executions** tab

### 6. Monitoring and Debugging

#### Execution Logs
- View detailed logs for each workflow run
- Check input/output data for each node
- Identify bottlenecks or failures

#### Common Issues and Solutions

**OpenAI API Errors:**
- Check API key validity
- Verify account has sufficient credits
- Monitor rate limits

**Google API Errors:**
- Refresh OAuth2 tokens if expired
- Check API quotas in Google Cloud Console
- Verify folder permissions

**Email Delivery Issues:**
- Check Gmail API limits
- Verify sender authentication
- Test with fewer recipients first

### 7. Customization Options

#### Modify AI Prompt
Edit the OpenAI node prompt to change output format:
```
Summarize this meeting transcript into key points, action items, and deadlines in a professional tone. 
Include sections for:
1. Meeting Summary
2. Key Decisions
3. Action Items with Owners
4. Next Meeting Date

Transcript: {{$json["transcript"]}}
```

#### Email Template Customization
Modify the Gmail node message for different formatting:
- Add company branding
- Include meeting metadata
- Change email styling

#### Additional Processing
Add nodes for:
- Slack notifications
- Calendar event creation
- CRM integration
- Document versioning

### 8. Production Considerations

#### Security
- Use environment variables for sensitive data
- Implement webhook authentication
- Set up proper CORS headers
- Regular credential rotation

#### Performance
- Monitor API usage and costs
- Implement caching for repeated requests
- Set up error notifications
- Scale n8n instance as needed

#### Backup
- Export workflow configurations regularly
- Document custom modifications
- Maintain version control for changes

### 9. Support and Troubleshooting

For issues with:
- **n8n**: Check [n8n documentation](https://docs.n8n.io/)
- **OpenAI**: Review [API documentation](https://platform.openai.com/docs)
- **Google APIs**: See [Google Cloud documentation](https://cloud.google.com/docs)

This workflow provides a robust foundation for automated meeting minutes generation and can be extended based on your specific requirements.
