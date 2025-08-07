import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const handler = async (event: any) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { product, plan } = JSON.parse(event.body || '{}');
    if (!product) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Product name is required.' }) };
    }

    const normalizedPlan = plan?.toLowerCase() || 'free';
    let sourcesToScanPrompt = "";
    let featureMentionsPrompt = "";
    let geminiSourceTypeInstruction = "";
    let maxIssues = 5;
    let allowedSourceTypesForGemini: string[] = [];

    // --- Logic from your original file ---
    if (normalizedPlan === 'free') {
        maxIssues = 4;
        sourcesToScanPrompt = `Scan the following conceptual sources for publicly available feedback. Focus on recent data (last 1-2 years conceptually):\n1. Google Articles: Analyze up to 10 relevant review articles and blog posts.\n2. YouTube Transcripts: Analyze transcripts from up to 10 relevant YouTube videos.`;
        allowedSourceTypesForGemini = ["Google Article", "YouTube Transcript"];
        featureMentionsPrompt = `Focus on clear, distinct issues or feature requests. Avoid overly similar points.`;
    } else if (normalizedPlan === 'pro') {
        maxIssues = 10;
        sourcesToScanPrompt = `Scan the following conceptual sources for publicly available feedback. Focus on recent data (last 1-2 years conceptually):\n1. Google Articles: Analyze up to 50 relevant review articles and blog posts.\n2. YouTube (Transcripts & Comments): Analyze transcripts and a significant sample of comments from up to 50 relevant YouTube videos.\n3. Twitter: Scan up to 5,000 tweets and related discussions.`;
        allowedSourceTypesForGemini = ["Google Article", "YouTube Transcript", "YouTube Comment", "Twitter Post"];
        featureMentionsPrompt = `Employ semantic duplicate detection to consolidate similar feedback into single, well-defined issues. Prioritize issues by their conceptual mention frequency.`;
    } else { // max
        maxIssues = 20; // Capped at 20 for performance
        sourcesToScanPrompt = `Scan the following conceptual sources for publicly available feedback. Focus on recent data (last 1-2 years conceptually):\n1. Google Articles: Analyze up to 100 relevant review articles and blog posts.\n2. YouTube (Transcripts & Comments): Analyze transcripts and a significant sample of comments from up to 100 relevant YouTube videos.\n3. Twitter: Scan up to 10,000 tweets and related discussions.\n4. Reddit: Search relevant subreddits for up to 5,000 posts and comments.\n5. Trustpilot: Examine up to 5,000 product reviews.`;
        allowedSourceTypesForGemini = ["Google Article", "YouTube Transcript", "YouTube Comment", "Twitter Post", "Reddit Post", "Trustpilot Review"];
        featureMentionsPrompt = `Employ advanced semantic duplicate detection to consolidate similar feedback. Prioritize issues by their conceptual mention frequency and sentiment across all scanned sources.`;
    }

    geminiSourceTypeInstruction = `- "type": Strictly one of ${JSON.stringify(allowedSourceTypesForGemini)}.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
      You are ProductHolmes, an AI specializing in analyzing customer feedback.
      For the product "${product}", identify and list DISTINCT issues, problems, bugs, negative feedback, and significant requested features.
      Prioritize actionable insights. Avoid generic positive comments.
      ${sourcesToScanPrompt}
      ${featureMentionsPrompt}
      Based on this comprehensive (simulated) scan, compile a list of up to ${maxIssues} distinct issues.
      For each distinct issue, provide:
      1. A concise "description" of the issue (1-2 sentences).
      2. A "category" from: "Bug", "Performance", "Usability", "Feature Request", "Hardware", "Software", "Support", "Pricing", "Design".
      3. A list of 2-3 simulated "sources" where this issue was identified. Each source must have:
          ${geminiSourceTypeInstruction}
          - "url": A plausible but entirely fictional placeholder URL.
          - "title": A realistic, concise title for the source.
      Format the entire output as a single, valid JSON array. Each element must be an object with "description", "category", and "sources" keys.
      Do not include any text, markdown, or anything else before or after the JSON array. The response must be ONLY the JSON array.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = await response.text();

    // Clean the response to ensure it's valid JSON
    const cleanedText = text.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: cleanedText, // Return the clean JSON string directly
    };

  } catch (error: any) {
    console.error('Gemini API function failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'The AI investigator encountered an unexpected problem.' }),
    };
  }
};
