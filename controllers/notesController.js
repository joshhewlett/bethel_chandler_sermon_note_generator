import {
    getSubtitles
} from 'youtube-captions-scraper';
import gptService from '../services/gptService.js';
import fetch from 'node-fetch';
import config from '../config/config.js';
import { marked } from 'marked';

const prompt = `
Transform the given sermon transcript into a structured document with the following sections.
The output should be in Markdown, but do not include the backticks.
Respond with nothing else but the result.

1. Sermon information
    1. The start of the page MUST follow this EXACT format:
**Title:** {extracted title}<br>
**Speaker:** {speaker name placeholder}<br>
**Date:** {date placeholder}<br>
**Scriptures:** {extracted scripture references}<br><br>

    2. IMPORTANT: Each line MUST end with <br>
    3. Each item MUST be on its own line
    4. The labels (Title, Speaker, Date, Scriptures) MUST be in bold using **
    5. Example of correct format:
**Title:** The Power of Prayer<br>
**Speaker:** John Smith<br>
**Date:** 2024-03-20<br>
**Scriptures:** John 3:16, Romans 8:28<br><br>
    6. Add a divider between this and the next section
    7. This section should not have a header or title. Let the above text be the first text in your response.
1. Summary of the sermon
	1. An H2 header with bold text titled "Summary"
	2. Generate a concise summary (4-6 sentences) capturing the main theme and key takeaways.
	4. Add a divider between this and the next section
2. Sermon Notes
	1. Denoted by an H2 header with bold text titled "Sermon notes"
	2. Structure the sermon into logical sections based on its content.
	3. Use informative bullet points. Ensure that clarity is not sacrificed for concise writing. The reader should understand the journey the speaker is making by reading these bullet points
	4. Any time a sub bullet point is used, ensure it's indented by 4 spaces
	5. Maintain clarity and readability while preserving key sermon details.
	6. Each logical section should have an H3 header and use roman numeral-style prefixes
	7. Add a divider between this and the next section
3. Application Questions
	1. A H2 header with bold text titled "Application Questions"
	2. Generate 3-4 reflective, open-ended questions that help the reader apply the sermon's teachings to their life.
	3. Base the questions on the sermon's themes and scriptural references.
---
`;

function extractVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

function validateParams(params) {
    const errors = [];

    // Destructure and validate required parameters
    const {
        youtubeLink,
        speakerName,
        sermonDate,
        bethelLocation,
        notesPrompt
    } = params;

    if (!youtubeLink) {
        errors.push('YouTube link is required');
    }

    if (!speakerName || speakerName.trim().length === 0) {
        errors.push('Speaker name is required');
    }

    if (!sermonDate) {
        errors.push('Sermon date is required');
    } else {
        // Validate date format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(sermonDate)) {
            errors.push('Invalid date format. Expected YYYY-MM-DD');
        }
    }

    if (!bethelLocation || !['Bethel South', 'Bethel SonRise'].includes(bethelLocation)) {
        errors.push('Invalid Bethel location');
    }

    if (!notesPrompt || notesPrompt.trim().length === 0) {
        errors.push('Notes prompt is required');
    }

    return {
        isValid: errors.length === 0,
        errors,
        params: {
            youtubeLink,
            speakerName,
            sermonDate,
            bethelLocation,
            userPrompt: notesPrompt
        }
    };
}

async function getVideoDetails(videoId) {
    const apiKey = config.youtubeApiKey; // Make sure to add this to your config
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            return {
                title: data.items[0].snippet.title,
                url: `https://www.youtube.com/watch?v=${videoId}`
            };
        }
        throw new Error('Video not found');
    } catch (error) {
        throw new Error('Failed to fetch video details: ' + error.message);
    }
}

export async function generateNewNotes(req, res, next) {
    try {
        // Validate form parameters
        const validation = validateParams(req.body);
        if (!validation.isValid) {
            throw new Error('Invalid parameters: ' + validation.errors.join(', '));
        }

        const {
            youtubeLink,
            speakerName,
            sermonDate,
            bethelLocation,
            userPrompt
        } = validation.params;

        // Extract and validate video ID
        const videoId = extractVideoId(youtubeLink);
        if (!videoId) {
            throw new Error('Invalid YouTube link provided.');
        }

        // Fetch video details
        const videoDetails = await getVideoDetails(videoId);

        // Fetch subtitles for the given video ID in English
        const captions = await getSubtitles({
            videoID: videoId,
            lang: 'en'
        });

        // Combine caption texts into one transcript string
        const transcript = captions.map(caption => caption.text).join(' ');

        const fullPrompt = userPrompt +
            "The speaker placeholder's value should be " + speakerName +
            ", and the sermon date place holder value should be " + sermonDate +
            "\n---\nTranscript:\n" + transcript;
        // const generatedNotes = await gptService.generateResponse(fullPrompt);
        const generatedNotes = tempResponse;

        console.log("customizedPrompt", fullPrompt);
        console.log("generatedNotes", generatedNotes);

        // Render the generated_notes view with the generated content
        res.render('generated_notes', {
            generatedNotes: generatedNotes.replace(/`/g, '\\`'), // Escape backticks to prevent JS template literal issues
            metadata: {
                speaker: speakerName,
                date: sermonDate,
                location: bethelLocation,
                video: videoDetails
            }
        });

    } catch (error) {
        next(new Error('Error generating notes: ' + error.message));
    }
}

// Render the notes generation form page
export function getGenerationIntakeForm(req, res) {
    res.render('generate_step1', {
        user: req.session.user,
        defaultPrompt: prompt
    });
}

const tempResponse = `
**Title:** Built to Last<br>
**Speaker:** Pastor Mike Gowens<br>
**Date:** 2025-02-02<br>
**Scriptures:** James 1:2-3, Micah 7:8, Proverbs 24:16, Matthew 16:13-20, Ephesians 1

---

## **Summary**

Pastor Mike Gowens reflects on the trials and triumphs of 2024, emphasizing the importance of seeking strength in God rather than relying solely on personal abilities. With 2025 underway, he shares his personal journey of embracing the word "rise" as a guiding theme, supported by scriptures such as Micah 7:8 and Proverbs 24:16. The sermon introduces a new series titled "Built to Last," focusing on the foundation of faith necessary to endure life's challenges. Pastor Mike highlights the significance of being rooted in Christ, suggesting that the church's resilience lies in its collective faith and unity. The sermon concludes with a call to surrender every aspect of life to Jesus, ensuring a lasting legacy in faith.

---

## **Sermon notes**

### **I. Reflection on 2024 and Personal Challenges**
- 2024 was a difficult yet fruitful year, with many coming to Christ despite personal struggles.
- Learned the importance of relying on God's strength rather than personal effort.
- James 1:2-3 serves as a reminder to find joy in trials, as they build character and reliance on God.

### **II. Embracing the Word "Rise" for 2025**
- Initially sought "fun" as a theme for 2025 but was led to "rise" by God.
- Micah 7:8 and Proverbs 24:16 inspired the focus on perseverance and rising after setbacks.
- Personal experiences, like caring for his father, reinforce the need for divine strength.

### **III. Introduction to the Series "Built to Last"**
- Emphasizes that longevity in faith is not achievable through human strength alone.
- Matthew 16:13-20 highlights the foundation of the church on the revelation of Jesus as Christ.
- Encourages believers to reflect on their understanding of who Jesus is to them personally.

### **IV. Our Identity and Promises in Christ (Ephesians 1)**
- In Christ, believers are blessed, chosen, adopted, graced, redeemed, and forgiven.
- Emphasizes the importance of spiritual blessings over material ones.
- Believers have an inheritance and are sealed with the Holy Spirit, assuring belonging to Christ.

### **V. The Role of the Church**
- The church, not individuals, is predestined to last; unity and community are essential.
- Jesus is the head of the church, and believers are called to be an active part of it.
- Encourages a shift from consumer Christianity to a life fully surrendered to Jesus as Lord.

### **VI. Call to Surrender and Reflect on Jesus' Lordship**
- Challenges listeners to identify areas of life not fully surrendered to Christ.
- Encourages repentance and the decision to bring every aspect of life under Jesus' lordship.
- Concludes with a communal prayer of surrender, committing to live a life built to last in Christ.

---

## **Application Questions**

1. Reflect on your personal trials in the past year. How can you find joy and growth through them as suggested in James 1:2-3?
2. What does the word "rise" mean to you in your current spiritual journey? How can you apply this concept in your daily life?
3. In what ways can you strengthen your foundation in Christ to ensure your faith endures through challenges?
4. How does being part of a church community help you grow and maintain your faith? What role can you play in supporting others within your church?
5. Consider areas of your life that may not be fully surrendered to Jesus. What steps can you take to bring these aspects under His lordship?
`

function validateLocation(location) {
    const validLocations = ['bethel chandler', 'bethel sonrise'];
    return validLocations.includes(location.toLowerCase());
}

export async function printNotes(req, res, next) {
    try {
        const { location, notes } = req.body;

        // Validate required fields
        if (!location || !notes) {
            throw new Error('Both location and notes are required');
        }

        // Validate location
        if (!validateLocation(location)) {
            throw new Error('Invalid location. Must be either "Bethel Chandler" or "Bethel SonRise"');
        }

        // Convert markdown to HTML
        const htmlContent = marked(notes, {
            gfm: true, // GitHub Flavored Markdown
            breaks: true, // Convert line breaks to <br>
            sanitize: true // Sanitize HTML tags in the markdown
        });

        // Render with print layout
        res.render('print-view', {
            layout: 'print-layout',
            content: htmlContent,
            location: location
        });

    } catch (error) {
        next(new Error('Error processing print request: ' + error.message));
    }
}