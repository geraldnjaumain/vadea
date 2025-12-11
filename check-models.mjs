import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyBUO6XObsiuyrXAaEEJFFSiVCueZ2LXAPg";

async function checkModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            const names = data.models.map(m => m.name.replace('models/', ''));
            console.log("AVAILABLE_MODELS_START");
            console.log(names.join('\n'));
            console.log("AVAILABLE_MODELS_END");
        } else {
            console.log("ERROR", data);
        }
    } catch (error) {
        console.error(error);
    }
}

checkModels();
