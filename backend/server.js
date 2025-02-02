import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { HfInference } from '@huggingface/inference';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

console.log('CORS Origin:', process.env.CORS_ORIGIN);

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    next();
});

// Initialize Hugging Face
const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);

// Test endpoint
app.get('/api/test', (req, res) => {
    console.log('Test endpoint hit');
    res.json({ message: 'Backend server is running!' });
});

// Chat completion endpoint
app.post('/api/chat', async (req, res) => {
    console.log(new Date().toISOString(), '- POST /api/chat');
    console.log('Headers:', req.headers);
    console.log('Chat endpoint hit');
    console.log('Request body:', req.body);
    
    try {
        const { prompt, systemPrompt } = req.body;
        // Format the prompt to be more explicit and structured for the model
        const fullPrompt = `You are a career advisor. Your role is defined as follows:
${systemPrompt}

A user has asked: "${prompt}"

Provide a helpful response that is:
- Professional and courteous
- Specific to career development and job search
- Actionable and practical
- Clear and concise

Your response:`;
        
        console.log('Sending request to Hugging Face with prompt:', fullPrompt);
        
        const response = await hf.textGeneration({
            model: "tiiuae/falcon-7b-instruct",  // Using a more sophisticated model
            inputs: fullPrompt,
            parameters: {
                max_new_tokens: 250,
                temperature: 0.7,
                top_p: 0.95,
                do_sample: true,
                repetition_penalty: 1.2
            }
        });

        console.log('Raw response from Hugging Face:', response);

        if (!response || typeof response.generated_text !== 'string') {
            console.error('Invalid response structure:', response);
            throw new Error('Invalid response from Hugging Face API');
        }

        const generatedText = response.generated_text.trim();
        console.log('Generated text:', generatedText);

        if (!generatedText) {
            throw new Error('Empty response from Hugging Face API');
        }

        // Clean up the response - extract only the actual response part
        let cleanedResponse = generatedText;
        
        // Remove everything up to and including "Your response:"
        const responseStart = cleanedResponse.indexOf('Your response:');
        if (responseStart !== -1) {
            cleanedResponse = cleanedResponse.substring(responseStart + 'Your response:'.length);
        }
        
        // Clean up any remaining artifacts
        cleanedResponse = cleanedResponse
            .replace(/^[\s\n]+/, '')  // Remove leading whitespace and newlines
            .replace(/^[-\s]*/, '')   // Remove leading dashes
            .replace(/^Assistant:[\s]*/i, '')
            .replace(/^Response:[\s]*/i, '')
            .replace(/^"/, '')        // Remove leading quotes
            .replace(/"$/, '')        // Remove trailing quotes
            .replace(/^-\s*/gm, '• ') // Replace dashes with bullet points
            .replace(/<\/?[^>]+(>|$)/g, '') // Remove HTML tags
            .replace(/&[^;]+;/g, '') // Remove HTML entities
            .trim();

        res.json({ response: cleanedResponse });
    } catch (error) {
        console.error('Hugging Face API Error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            error: 'An error occurred while processing your request',
            details: error.message,
            stack: error.stack
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        details: err.message
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`CORS Origin: ${process.env.CORS_ORIGIN}`);
}); 