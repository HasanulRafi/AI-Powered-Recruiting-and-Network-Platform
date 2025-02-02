import { useState } from 'react';
import { OpenAIService } from '../services/openai/openaiService';

export const AIJobDescription = () => {
    const [companyInfo, setCompanyInfo] = useState('');
    const [roleDetails, setRoleDetails] = useState('');
    const [generatedDescription, setGeneratedDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        setIsLoading(true);
        setError('');
        
        try {
            const openAIService = OpenAIService.getInstance();
            const response = await openAIService.generateJobDescription(companyInfo, roleDetails);
            
            if (response.error) {
                setError(response.error);
            } else {
                setGeneratedDescription(response.content);
            }
        } catch (err) {
            setError('Failed to generate job description. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <h2 className="text-2xl font-bold mb-4">AI Job Description Generator</h2>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Company Information
                    </label>
                    <textarea
                        className="w-full p-2 border rounded-md"
                        rows={3}
                        value={companyInfo}
                        onChange={(e) => setCompanyInfo(e.target.value)}
                        placeholder="Enter company information..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Role Details
                    </label>
                    <textarea
                        className="w-full p-2 border rounded-md"
                        rows={3}
                        value={roleDetails}
                        onChange={(e) => setRoleDetails(e.target.value)}
                        placeholder="Enter role details..."
                    />
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !companyInfo || !roleDetails}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Generating...' : 'Generate Description'}
                </button>

                {error && (
                    <div className="text-red-600 p-3 bg-red-50 rounded-md">
                        {error}
                    </div>
                )}

                {generatedDescription && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Generated Description:</h3>
                        <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
                            {generatedDescription}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}; 