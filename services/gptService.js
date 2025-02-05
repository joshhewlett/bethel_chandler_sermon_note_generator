// gpt4oMiniService.js
import OpenAIApi from 'openai'
const openai = new OpenAIApi();

/**
 * Generates a response from the gpt-4o-mini model.
 *
 * @param {string} prompt - A prompt of up to 10K tokens.
 * @returns {Promise<string>} The text response from the model.
 */
async function generateResponse(prompt) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o", // Confirm that this is the correct model name
            messages: [{
                "role": "user",
                content: prompt
            }],
            max_tokens: 1500, // Adjust output token count as necessary
            temperature: 0.7, // Modify temperature for desired randomness
            store: true
        });
        console.log(response);
        return response.choices[0].message.content;
    } catch (error) {
        console.error("Error generating response:", error);
        throw error;
    }
}

export default {
    generateResponse
}