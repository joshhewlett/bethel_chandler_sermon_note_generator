import {
    getSubtitles
} from 'youtube-captions-scraper';
import gptService from '../services/gptService.js';

const prompt = `
Transform the given sermon transcript into a structured document with the following sections. The output should be in Markdown. Respond with nothing else but the result. 

1. Header information
	2. The section should exclusively contain the following text:
	\`\`\`
	Title: {extracted title from transcript}
	Speaker: [Placeholder]
	Date: [Placeholder]
	Scriptures: {extracted scripture references from transcript}
	\`\`\`
	3. The colon and everything before it should be in bold
	4. Add a divider between this and the next section
1. Summary of the sermon
	1. A bold H2 header titled "Summary"
	2. Generate a concise summary (4-6 sentences) capturing the main theme and key takeaways.
	4. Add a divider between this and the next section
2. Sermon Notes 
	1. Denoted by a bold H2 header titled "Sermon notes" 
	2. Structure the sermon into logical sections based on its content. 
	3. Use informative bullet points. Ensure that clarity is not sacrificed for concise writing. The reader should understand the journey the speaker is making by reading these bullet points 
	4. Any time a sub bullet point is used, ensure it's indented by 4 spaces 
	5. Maintain clarity and readability while preserving key sermon details. 
	6. Each logical section should have an H3 header and use roman numeral-style prefixes 
	7. Add a divider between this and the next section
3. Application Questions
	1. A bold H2 header titled "Application Questions"
	2. Generate 3-5 reflective, open-ended questions that help the reader apply the sermon’s teachings to their life.
	3. Base the questions on the sermon’s themes and scriptural references.
---

`;

function extractVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

export async function generateNewNotes(req, res, next) {

    const videoId = extractVideoId(req.body.youtubeLink);
    if (!videoId) {
        throw new Error('Invalid YouTube link provided.');
    }

    try {
        // Fetch subtitles for the given video ID in English.
        const captions = await getSubtitles({
            videoID: videoId,
            lang: 'en'
        });

        // Optionally combine the caption texts into one transcript string.
        const transcript = captions.map(caption => caption.text).join(' ');

        // return {
        //     youtubeLink,
        //     speakerName,
        //     sermonDate,
        //     bethelLocation,
        //     notesPrompt,
        //     videoId,
        //     transcript
        // };

        res.send(await gptService.generateResponse(prompt + transcript));


    } catch (error) {
        throw new Error('Error fetching transcript: ' + error.message);
    }
}