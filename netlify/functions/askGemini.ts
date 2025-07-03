import { Handler } from '@netlify/functions';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const handler: Handler = async (event) => {
  const { product } = JSON.parse(event.body || '{}');

  const prompt = `
Act as a product feedback investigator. Generate 5 realistic product complaints for the product: "${product}".
Only show problems, not praise.
Start the list with: 1.
  `.trim();

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  try {
    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ issues: text }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Gemini API failed.' }),
    };
  }
};

export { handler };
