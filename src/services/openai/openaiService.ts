// Types for responses
export interface ChatResponse {
    content: string;
    error?: string;
}

export class OpenAIService {
    private static instance: OpenAIService;
    private apiUrl: string;

    private constructor() {
        this.apiUrl = 'http://localhost:3000/api';
    }

    public static getInstance(): OpenAIService {
        if (!OpenAIService.instance) {
            OpenAIService.instance = new OpenAIService();
        }
        return OpenAIService.instance;
    }

    /**
     * Test the backend API connection
     */
    private async testApiKey() {
        try {
            console.log('Testing API connection...');
            const response = await fetch(`${this.apiUrl}/test`);
            if (!response.ok) {
                throw new Error('API test failed');
            }
            const data = await response.json();
            console.log('✅ API connection is valid and working!');
            return true;
        } catch (error: any) {
            console.error('❌ API test failed:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
            return false;
        }
    }

    /**
     * Generate a chat completion using our backend API
     */
    public async generateChatCompletion(
        prompt: string,
        systemPrompt: string = "You are a helpful assistant."
    ): Promise<ChatResponse> {
        try {
            console.log('Sending request to backend:', {
                prompt,
                systemPrompt
            });

            const response = await fetch(`${this.apiUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt,
                    systemPrompt
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get response from server');
            }

            const data = await response.json();
            console.log('Backend response:', data);

            if (!data.response) {
                throw new Error('No response received from server');
            }

            return {
                content: data.response,
            };
        } catch (error: any) {
            console.error('Error calling backend:', error);
            return {
                content: '',
                error: error.message || 'Failed to generate response. Please try again.'
            };
        }
    }

    /**
     * Example method for generating AI-powered job descriptions
     */
    public async generateJobDescription(
        companyInfo: string,
        roleDetails: string
    ): Promise<ChatResponse> {
        const prompt = `Create a professional job description for the following role:
        Company Information: ${companyInfo}
        Role Details: ${roleDetails}
        Please format it in a clear, engaging way that will attract qualified candidates.`;

        const systemPrompt = "You are an expert HR professional who specializes in writing compelling job descriptions.";
        
        return this.generateChatCompletion(prompt, systemPrompt);
    }
} 