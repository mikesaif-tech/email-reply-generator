export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return response.status(500).json({ error: 'Server Configuration Error: Missing API Key' });
    }

    try {
        const body = request.body;
        const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

        const apiResponse = await fetch(`${apiUrl}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        const data = await apiResponse.json();

        if (!apiResponse.ok) {
            return response.status(apiResponse.status).json(data);
        }

        return response.status(200).json(data);
    } catch (error) {
        console.error('API Error:', error);
        return response.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
