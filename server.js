import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import { config } from 'dotenv';
import cors from 'cors';

config(); // Loads variables from .env file into process.env

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/api/perform-task', cors(), async (req, res) => {
    const { text, task, language } = req.body;

    // Function to generate the appropriate prompt for each task
    function getPrompt(task, text, language) {
        switch (task) {
            case 'improve':
                return `Rewrite the following text to make it clearer and more engaging, providing each suggestion on a new line:: ${text}`;
            case 'spellcheck':
                return `Correct the spelling of this text, each pair on a new line: : ${text}`;
            case 'paraphrase':
                return `Rephrase the following sentence while maintaining its original meaning: ${text}`;
            case 'summarize':
                return `Summarize the key points of the following text in a brief paragraph: ${text}`;
            case 'shorten':
                return `Condense the following text into a shorter version without losing any critical information: ${text}`;
            case 'lengthen':
                return `Expand on the following text by elaborating on the key points: ${text}`;
            case 'simplify':
                return `Simplify the following text to make it understandable for a 5th-grade student: ${text}`;
            case 'continue':
                return `Continue the following text in a consistent style and tone: ${text}`;
            case 'translate':
                const languageMap = {
                    'te': 'Telugu',
                    'hi': 'Hindi',
                    'ml': 'Malayalam',
                    'ta': 'Tamil',
                    'de': 'German',
                    'ru': 'Russian',
                    // Add other languages as needed
                };
                const Language = languageMap[language] || 'English';
                return `Translate the following text into ${Language}: ${text}`;
            case 'action_items':
                return `Identify any action items in the following meeting notes: ${text}`;
            case 'explain':
                return `Explain the following concept in simple terms: ${text}`;
            case 'friendliness':
                return `Rewrite the following text to be more friendly, while keeping the original message intact: ${text}`;
            case 'politeness':
                return `Rewrite the following text to be more polite, ensuring to maintain the message's original intent: ${text}`;
            case 'professionalism':
                return `Rewrite the following text to sound more professional, suitable for a formal business setting: ${text}`;
            case 'sarcasm':
                return `Analyze the following text for sarcasm and if detected, rewrite the message to convey the meaning straightforwardly: ${text}`;
            case 'QA':
                return `Provide detailed and accurate solutions or answers to the following questions. Each response should be well-researched, clear, and informative with bullet points, each point on a new line: ${text}`;
            case 'cp':
                return `Assist in crafting specialized prompts for various text generation tasks using an AI model like GPT-3 or GPT-4. Each prompt should be targeted, clear, and effective in eliciting a specific type of response or output with a series of steps or points, each on a new line: Place each prompt on a separate line. Provide guidelines or examples of prompts for the following scenarios: ${text}`;
            default:
                return `Please complete the task: ${text}`;
        }
    }

    const prompt = getPrompt(task, text, language);
    const requestBody = {
        prompt: prompt,
        temperature: 0.7,
        max_tokens: 150,
        model: "text-davinci-003"  // Use a model that is appropriate for the task
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
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
