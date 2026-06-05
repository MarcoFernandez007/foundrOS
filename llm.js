// llm.js - Centralized Gemini API Engine

const LLMEngine = {
    async generateContent(prompt, systemInstruction = null, responseSchema = null) {
        const apiKey = AppState.apiKeys.gemini;
        
        if (!apiKey) {
            throw new Error('Gemini API key is missing. Please configure it in the API settings.');
        }

        const model = 'gemini-2.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const requestBody = {
            contents: [{ parts: [{ text: prompt }] }]
        };

        if (systemInstruction) {
            requestBody.systemInstruction = {
                parts: [{ text: systemInstruction }]
            };
        }

        if (responseSchema) {
            requestBody.generationConfig = {
                responseMimeType: "application/json",
                responseSchema: responseSchema
            };
        } else {
             requestBody.generationConfig = {
                temperature: 0.7
             };
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error?.message || 'API request failed');
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates[0].content.parts[0].text) {
                const text = data.candidates[0].content.parts[0].text;
                if (responseSchema) {
                    return JSON.parse(text);
                }
                return text;
            } else {
                throw new Error('Invalid response structure from Gemini API');
            }
        } catch (error) {
            console.error('LLMEngine Error:', error);
            throw error;
        }
    }
};

window.LLMEngine = LLMEngine;
