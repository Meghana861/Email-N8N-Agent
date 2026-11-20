// Test script to verify n8n webhook connection
const testTranscript = `
Meeting transcript from Project Planning Session
Date: ${new Date().toLocaleDateString()}

Participants:
- John Smith (john@example.com)
- Jane Doe (jane@example.com)
- Mike Johnson (mike@company.com)

Discussion Points:
1. Project timeline review
2. Budget allocation for Q4
3. Resource requirements

Action Items:
- John to review budget proposal by Friday
- Jane to prepare presentation for stakeholders
- Mike to coordinate with external vendors

Next meeting scheduled for next Tuesday at 2 PM.
`;

async function testWorkflow() {
    const webhookUrl = 'http://localhost:5678/webhook-test/meeting-minutes';
    
    console.log('Testing n8n workflow connection...');
    console.log('Webhook URL:', webhookUrl);
    
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                transcript: testTranscript
            })
        });

        console.log('Response status:', response.status);
        
        if (response.ok) {
            const result = await response.text();
            console.log('✅ Success! Workflow executed successfully');
            console.log('Response:', result);
        } else {
            console.log('❌ Error: Workflow execution failed');
            console.log('Status:', response.status, response.statusText);
        }
    } catch (error) {
        console.log('❌ Connection Error:', error.message);
        console.log('Make sure n8n is running on http://localhost:5678');
    }
}

// Run the test if this is executed directly
if (typeof window === 'undefined') {
    // Node.js environment
    const fetch = require('node-fetch');
    testWorkflow();
} else {
    // Browser environment
    window.testWorkflow = testWorkflow;
    console.log('Test function loaded. Run testWorkflow() to test the connection.');
}
