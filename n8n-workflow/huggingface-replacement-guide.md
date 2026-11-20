# Replace OpenAI Node with Hugging Face (Free Alternative)

## Step 1: Remove OpenAI Node and Add HTTP Request Node

### 1. Delete the OpenAI Node
- In your n8n workflow canvas
- Click on the "Generate Minutes with OpenAI" node
- Press Delete key or click the trash icon

### 2. Add HTTP Request Node
- Click the "+" button between "Extract Emails" and "Create Google Doc" nodes
- Search for "HTTP Request" 
- Add the HTTP Request node

### 3. Configure HTTP Request Node

**Node Name:** `Generate Minutes with Hugging Face`

**Basic Settings:**
- **Method:** `POST`
- **URL:** `https://api-inference.huggingface.co/models/microsoft/DialoGPT-large`

**Headers:**
Click "Add Header" and set:
```
Name: Content-Type
Value: application/json
```

**Body (JSON):**
```json
{
  "inputs": "Create professional meeting minutes from this transcript. Include: 1. Meeting Summary 2. Key Discussion Points 3. Action Items with responsible parties 4. Next Steps and deadlines\n\nTranscript: {{ $json.transcript }}",
  "parameters": {
    "max_length": 800,
    "temperature": 0.7,
    "do_sample": true
  }
}
```

### 4. Alternative Free Models to Try

If DialoGPT doesn't work well, try these other free Hugging Face models:

#### Option A: Text Generation Model
**URL:** `https://api-inference.huggingface.co/models/gpt2`

#### Option B: Instruction Following Model  
**URL:** `https://api-inference.huggingface.co/models/google/flan-t5-large`

**Body for Flan-T5:**
```json
{
  "inputs": "Summarize this meeting transcript into professional meeting minutes with action items: {{ $json.transcript }}"
}
```

### 5. Connect the Nodes
- Connect "Extract Emails" output to "Generate Minutes with Hugging Face" input
- Connect "Generate Minutes with Hugging Face" output to "Create Google Doc" input

### 6. Handle the Response

The Hugging Face API returns an array with the generated text. You may need to add a **Function node** after the HTTP Request to extract the text:

**Function Node Code:**
```javascript
// Extract the generated text from Hugging Face response
let generatedText = '';

if (Array.isArray($json.body) && $json.body.length > 0) {
  generatedText = $json.body[0].generated_text || $json.body[0];
} else if (typeof $json.body === 'string') {
  generatedText = $json.body;
} else {
  generatedText = JSON.stringify($json.body);
}

// Clean up the response to get only the meeting minutes part
const transcript = $node["Extract Emails"].json.transcript;
const minutes = generatedText.replace(transcript, '').trim();

return {
  json: {
    minutes: minutes,
    provider: 'huggingface',
    model: 'dialoGPT-large',
    timestamp: new Date().toISOString(),
    emails: $node["Extract Emails"].json.emails,
    transcript: transcript
  }
};
```

### 7. Test the Setup
1. Save your workflow
2. Click "Execute workflow" 
3. Send a test transcript from your frontend
4. Check if the minutes are generated properly

### 8. Troubleshooting

If you get errors:

**Error: Model loading**
- Hugging Face models may take 20+ seconds to load on first use
- Try again after waiting

**Error: Rate limiting** 
- Hugging Face has rate limits on free tier
- Wait a few minutes between requests

**Error: Poor quality output**
- Try a different model URL from the alternatives above
- Adjust the `max_length` parameter

### 9. Production Tips

For better results in production:
- Get a free Hugging Face account for higher rate limits
- Use the API token in headers: `Authorization: Bearer YOUR_HF_TOKEN`
- Consider using a more advanced model like `microsoft/DialoGPT-medium`

This setup provides completely free AI-powered meeting minutes generation without OpenAI costs or quotas!
