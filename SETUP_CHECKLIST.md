# Quick Setup Checklist

## ✅ What's Ready
- [x] Frontend code updated with correct webhook URL
- [x] n8n is installed (version 1.106.3)
- [x] Workflow JSON file available
- [x] Setup scripts created

## 🔧 Next Steps to Complete Setup

### 1. Start n8n and Import Workflow
```bash
# Start n8n
n8n start
```
- Open http://localhost:5678
- Create admin account (first time)
- Import `n8n-workflow/meeting-minutes-workflow.json`

### 2. Configure API Credentials

#### OpenAI (Required):
- Get API key from https://platform.openai.com/api-keys
- Add to n8n: Settings → Credentials → OpenAI

#### Google Services (Required for full functionality):
- Google Cloud Console setup
- Enable: Docs API, Gmail API, Drive API
- OAuth2 credentials
- Add to n8n: Settings → Credentials → Google OAuth2 API

### 3. Test the Setup
```bash
# Option 1: Use the startup script
.\start-all-services.bat

# Option 2: Start manually
# Terminal 1:
n8n start

# Terminal 2:
cd meeting-minutes-frontend
npm run dev
```

### 4. Verify Connection
- Frontend: http://localhost:3000
- n8n: http://localhost:5678
- Upload `sample-transcript.txt` via frontend

## 🎯 Expected Flow
1. User uploads transcript → Frontend
2. Frontend sends POST → n8n webhook
3. n8n extracts emails → OpenAI generates minutes → Google Docs → Gmail

## 🔍 Troubleshooting
- Check both services are running
- Verify webhook URL in App.jsx
- Check n8n execution logs
- Ensure workflow is activated

## 📱 Quick Test
Run this in browser console (when frontend is open):
```javascript
testWorkflow(); // Will test the n8n connection
```

Your frontend is ready! Just need to complete the n8n workflow setup.
