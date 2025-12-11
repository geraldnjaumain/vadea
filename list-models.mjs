import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyBUO6XObsiuyrXAaEEJFFSiVCueZ2LXAPg";

async function listModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            console.log("Found models count:", data.models.length);
            data.models.forEach(m => {
                // Print everything for debugging
                console.log(`Name: ${m.name}`);
                console.log(`Methods: ${JSON.stringify(m.supportedGenerationMethods)}`);
                console.log('---');
            });
        } else {
            console.log("No models found or error:", JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
