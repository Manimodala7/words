import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import { config } from 'dotenv';
import cors from 'cors';

// Load variables from .env file into process.env
config();

// Create an instance of Express
const app = express();
app.use(cors());

// Define the port
const port = process.env.PORT || 3000;

// Use body-parser middleware
app.use(bodyParser.json());

// Language mapping
const languageMap = {
    'en': 'English',
    'te': 'Telugu',
    'hi': 'Hindi',
    'ml': 'Malayalam',
    'ta': 'Tamil',
    'de': 'German',
    'ru': 'Russian',
    // Add other languages as needed
};

// Define the API endpoint to handle the tasks
app.post('/api/perform-task', cors(), async (req, res) => {
    const { text, task, language } = req.body;

    // Function to generate the appropriate prompt for each task and language
    function getPrompt(task, text, language) {
        const langName = languageMap[language] || 'English';
        switch (task) {
            case 'improve':
                return `Rewrite the following text to make it clearer and more engaging, providing each suggestion on a new line (${langName}): ${text}`;
            case 'spellcheck':
                return `Correct the spelling of this text, each pair on a new line (${langName}): ${text}`;
            case 'paraphrase':
                return `Rephrase the following sentence while maintaining its original meaning (${langName}): ${text}`;
            case 'summarize':
                return `Summarize the key points of the following text in a brief paragraph (${langName}): ${text}`;
            case 'shorten':
                return `Condense the following text into a shorter version without losing any critical information (${langName}): ${text}`;
            case 'lengthen':
                return `Expand on the following text by elaborating on the key points (${langName}): ${text}`;
            case 'simplify':
                return `Simplify the following text to make it understandable for a 5th-grade student (${langName}): ${text}`;
            case 'continue':
                return `Continue the following text in a consistent style and tone (${langName}): ${text}`;
            case 'translate':
                return `Translate the following text into ${langName}: ${text}`;
            case 'action_items':
                return `Identify any action items in the following meeting notes (${langName}): ${text}`;
            case 'explain':
                return `Explain the following concept in simple terms (${langName}): ${text}`;
            case 'friendliness':
                return `Rewrite the following text to be more friendly, while keeping the original message intact (${langName}): ${text}`;
            case 'politeness':
                return `Rewrite the following text to be more polite, ensuring to maintain the message's original intent (${langName}): ${text}`;
            case 'professionalism':
                return `Rewrite the following text to sound more professional, suitable for a formal business setting (${langName}): ${text}`;
            case 'sarcasm':
                return `Analyze the following text for sarcasm and if detected, rewrite the message to convey the meaning straightforwardly (${langName}): ${text}`;
            case 'QA':
                return `Provide detailed and accurate solutions or answers to the following questions (${langName}): ${text}`;
            case 'cp':
                return `Assist in crafting specialized prompts for various text generation tasks using an AI model like GPT-3 or GPT-4 (${langName}): ${text}`;
            default:
                return `Please complete the task: ${text}`;
        }
    }

    const prompt = getPrompt(task, text, language);
    const requestBody = {
        prompt: prompt,
        temperature: 0.7,
        max_tokens: 150,
        model: "gpt-3.5-turbo-instruct",  // Use the free version: text-davinci-codex
    };

    try {
        const apiResponse = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!apiResponse.ok) {
            console.error('Error from OpenAI:', await apiResponse.text());
            throw new Error(`Error from OpenAI: ${apiResponse.statusText}`);
        }

        const apiData = await apiResponse.json();
        res.json({ result: apiData.choices[0].text });
    } catch (error) {
        console.error('Error when calling OpenAI API:', error);
        res.status(500).json({ error: error.message });
    }});

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
